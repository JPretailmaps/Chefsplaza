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
  Param,
  Delete,
  Get,
  Query,
  forwardRef,
  Inject,
  Request,
  UseInterceptors
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData, getConfig } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto, FileUploaded, FileUploadInterceptor } from 'src/modules/file';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import {
  FeedCreatePayload, FeedSearchRequest, PollCreatePayload
} from '../payloads';
import { FeedDto } from '../dtos';
import { FeedService, FeedFileService } from '../services';

@Injectable()
@Controller('performer/feeds')
export class PerformerFeedController {
  constructor(
    private readonly feedService: FeedService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly feedFileService: FeedFileService
  ) {}

  @Post('/')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Body() payload: FeedCreatePayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.create(payload, user);
    return DataResponse.ok(data);
  }

  @Get('/')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getMyFeeds(
    @Query() query: FeedSearchRequest,
    @CurrentUser() performer: UserDto,
    @Request() req: any
  ): Promise<DataResponse<PageableData<any>>> {
    const data = await this.feedService.search(query, performer, req.jwToken);
    return DataResponse.ok(data);
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getPerformerFeed(
    @CurrentUser() user: UserDto,
    @Param('id') id: string,
    @Request() req: any
  ): Promise<DataResponse<FeedDto>> {
    const data = await this.feedService.findOne(id, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Put('/:id')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateFeed(
    @CurrentUser() user: UserDto,
    @Param('id') id: string,
    @Body() payload: FeedCreatePayload
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.updateFeed(id, user, payload);
    return DataResponse.ok(data);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async deletePerformerFeed(
    @CurrentUser() user: UserDto,
    @Param('id') id: string
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.deleteFeed(id, user);
    return DataResponse.ok(data);
  }

  @Post('/polls')
  @UseGuards(RoleGuard)
  @Roles('performer')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createPollFeed(
    @Body() payload: PollCreatePayload,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.createPoll(payload, user);
    return DataResponse.ok(data);
  }

  @Post('photo/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('feed-photo', 'file', {
      destination: getConfig('file').feedProtectedDir,
      acl: S3ObjectCannelACL.AuthenticatedRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadImage(
    @FileUploaded() file: FileDto
  ): Promise<any> {
    await this.feedFileService.validatePhoto(file);
    return DataResponse.ok({
      success: true,
      ...file.toResponse(),
      url: file.getUrl()
    });
  }

  @Post('video/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('feed-video', 'file', {
      destination: getConfig('file').feedProtectedDir,
      acl: S3ObjectCannelACL.AuthenticatedRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadVideo(
    @FileUploaded() file: FileDto
  ): Promise<any> {
    await this.feedFileService.validateVideo(file);
    return DataResponse.ok({
      success: true,
      ...file.toResponse(),
      url: file.getUrl()
    });
  }

  @Post('audio/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('feed-audio', 'file', {
      destination: getConfig('file').feedProtectedDir,
      acl: S3ObjectCannelACL.AuthenticatedRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadAudio(
    @FileUploaded() file: FileDto
  ): Promise<any> {
    await this.feedFileService.validateAudio(file);
    return DataResponse.ok({
      success: true,
      ...file.toResponse(),
      url: file.getUrl()
    });
  }

  @Post('thumbnail/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('feed-photo', 'file', {
      destination: getConfig('file').feedDir,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadThumb(
    @FileUploaded() file: FileDto
  ): Promise<any> {
    await this.feedFileService.validatePhoto(file);
    return DataResponse.ok({
      success: true,
      ...file.toResponse(),
      url: file.getUrl()
    });
  }

  @Post('teaser/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('performer')
  @UseInterceptors(
    FileUploadInterceptor('feed-video', 'file', {
      destination: getConfig('file').feedDir,
      acl: S3ObjectCannelACL.PublicRead,
      server: Storage.S3
    })
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadTeaser(
    @FileUploaded() file: FileDto
  ): Promise<any> {
    await this.feedFileService.validateTeaser(file);
    return DataResponse.ok({
      success: true,
      ...file.toResponse(),
      url: file.getUrl()
    });
  }
}
