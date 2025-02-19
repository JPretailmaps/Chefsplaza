import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Put,
  Get,
  Param,
  Query,
  Request,
  UseInterceptors,
  HttpException,
  Inject,
  forwardRef
} from '@nestjs/common';
import {
  DataResponse,
  PageableData,
  getConfig,
  ForbiddenException
} from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { LoadUser, RoleGuard } from 'src/modules/auth/guards';
import { CurrentUser, Roles } from 'src/modules/auth/decorators';
import {
  FileUploadInterceptor, FileUploaded, FileDto
} from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { CountryService } from 'src/modules/utils/services';
import { UserDto } from 'src/modules/user/dtos';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { PERFORMER_STATUSES } from '../constants';
import {
  PerformerDto
} from '../dtos';
import {
  SelfUpdatePayload,
  PerformerSearchPayload,
  BankingSettingPayload,
  PaymentGatewaySettingPayload
} from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';

@Injectable()
@Controller('performers')
export class PerformerController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => CountryService))
    private readonly countryService: CountryService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    private readonly performerService: PerformerService,
    private readonly performerSearchService: PerformerSearchService

  ) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async me(
    @Request() req: any
  ): Promise<DataResponse<PerformerDto>> {
    const user = await this.performerService.getDetails(req.user._id, req.jwToken);
    return DataResponse.ok(new PerformerDto(user).toResponse(true, false));
  }

  @Get('/user/search')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async usearch(
    @Query() query: PerformerSearchPayload,
    @CurrentUser() currentUser: UserDto
  ): Promise<DataResponse<PageableData<PerformerDto>>> {
    const data = await this.performerSearchService.search(query, currentUser);
    return DataResponse.ok(data);
  }

  @Get('/search/random')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async randomSearch(
    @Query() req: PerformerSearchPayload,
    @CurrentUser() currentUser: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.performerSearchService.randomSearch(req, currentUser);
    return DataResponse.ok(data);
  }

  @Put('/:id')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUser(
    @Body() payload: SelfUpdatePayload,
    @Param('id') performerId: string,
    @Request() req: any
  ): Promise<DataResponse<PerformerDto>> {
    await this.performerService.selfUpdate(performerId, payload);
    const performer = await this.performerService.getDetails(performerId, req.jwToken);

    if (payload.password) {
      await this.authService.createAuthPassword({
        source: 'performer',
        sourceId: performer._id,
        type: 'password',
        key: performer.email || performer.username,
        value: payload.password
      });
    }
    return DataResponse.ok(new PerformerDto(performer).toResponse(true, false));
  }

  @Get('/:username')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getDetails(
    @Param('username') performerUsername: string,
    @Request() req: any,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<Partial<PerformerDto>>> {
    let ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // eslint-disable-next-line prefer-destructuring
    ipAddress = ipAddress.split(',')[0];
    // const ipClient = '115.75.211.252';
    let userCountry = null;
    let countryCode = req.headers['cf-ipcountry'] || null;
    if (!ipAddress.includes('127.0.0.1') && !countryCode && !user?.isPerformer) {
      userCountry = await this.countryService.findCountryByIP(ipAddress);
      if (userCountry && userCountry.status === 'success' && userCountry.countryCode) {
        countryCode = userCountry.countryCode;
      }
    }
    const performer = await this.performerService.findByUsername(
      performerUsername,
      countryCode,
      user
    );

    if (!performer || performer.status !== PERFORMER_STATUSES.ACTIVE) {
      throw new HttpException('This account is suspended', 403);
    }

    return DataResponse.ok(performer.toPublicDetailsResponse());
  }

  @Post('/documents/upload/:type')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileUploadInterceptor('performer-document', 'file', {
      destination: getConfig('file').documentDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.AuthenticatedRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerDocument(
    @CurrentUser() currentUser: PerformerDto,
    @FileUploaded() file: FileDto,
    @Param('type') type: any,
    @Request() req: any
  ): Promise<any> {
    await this.performerService.updateDocument(currentUser._id, file, type);
    return DataResponse.ok({
      ...file,
      url: `${file.getUrl(true)}?performerId=${currentUser._id}&token=${req.jwToken}`
    });
  }

  @Post('/avatar/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('avatar', 'avatar', {
      destination: getConfig('file').avatarDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerAvatar(
    @FileUploaded() file: FileDto,
    @CurrentUser() performer: UserDto
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateAvatar(performer._id, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Post('/cover/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('cover', 'cover', {
      destination: getConfig('file').coverDir,
      uploadImmediately: true,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerCover(
    @FileUploaded() file: FileDto,
    @CurrentUser() performer: UserDto
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateCover(performer._id, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl()
    });
  }

  @Post('/welcome-video/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('performer-welcome-video', 'welcome-video', {
      destination: getConfig('file').videoDir,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadPerformerVideo(
    @FileUploaded() file: FileDto,
    @CurrentUser() performer: PerformerDto
  ): Promise<any> {
    // TODO - define url for perfomer id if have?
    await this.performerService.updateWelcomeVideo(performer._id, file);
    return DataResponse.ok({
      ...file,
      url: file.getUrl(true)
    });
  }

  @Put('/:id/banking-settings')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateBankingSetting(
    @Param('id') performerId: string,
    @Body() payload: BankingSettingPayload,
    @CurrentUser() user: UserDto
  ) {
    const data = await this.performerService.updateBankingSetting(
      performerId,
      payload,
      user
    );
    return DataResponse.ok(data);
  }

  @Put('/:id/payment-gateway-settings')
  @HttpCode(HttpStatus.OK)
  @Roles('performer')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updatePaymentGatewaySetting(
    @Body() payload: PaymentGatewaySettingPayload,
    @CurrentUser() user: UserDto
  ) {
    // eslint-disable-next-line no-param-reassign
    payload.performerId = user._id as any;
    const data = await this.performerService.updatePaymentGateway(payload);
    return DataResponse.ok(data);
  }

  @Get('/documents/auth/check')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async checkAuth(
    @Request() req: any
  ) {
    if (!req.query.token || !req.query.performerId) throw new ForbiddenException();
    const auth = await this.authService.verifySession(req.query.token);
    if (!auth) throw new ForbiddenException();
    const user = await this.authService.getSourceFromAuthSession({ source: auth.source, sourceId: auth.sourceId });
    if (!user) {
      throw new ForbiddenException();
    }
    if (user.roles && user.roles.indexOf('admin') > -1) {
      return true;
    }
    if (req.query.performerId === `${user._id}`) return true;
    throw new ForbiddenException();
  }
}
