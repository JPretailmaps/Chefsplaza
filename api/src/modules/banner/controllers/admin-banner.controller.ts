import {
  Controller,
  Injectable,
  UseGuards,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Put,
  Param,
  Delete,
  Get,
  Query,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { MultiFileUploadInterceptor, FilesUploaded } from 'src/modules/file';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { UserDto } from 'src/modules/user/dtos';
import {
  BannerCreatePayload,
  BannerUpdatePayload,
  BannerSearchRequest
} from '../payloads';
import { BannerService, BannerSearchService } from '../services';

@Injectable()
@Controller('admin/banner')
export class AdminBannerController {
  constructor(
    private readonly bannerService: BannerService,
    private readonly bannerSearchService: BannerSearchService
  ) {}

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    MultiFileUploadInterceptor([
      {
        type: 'banner',
        fieldName: 'banner',
        options: {
          destination: getConfig('file').imageDir,
          uploadImmediately: true,
          acl: S3ObjectCannelACL.PublicRead,
          server: Storage.S3
        }
      }
    ])
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async upload(
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: BannerCreatePayload,
    @CurrentUser() creator: UserDto
  ): Promise<any> {
    const resp = await this.bannerService.create(
      files.banner,
      payload,
      creator
    );
    return DataResponse.ok(resp);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() payload: BannerUpdatePayload,
    @CurrentUser() updater: UserDto
  ) {
    const details = await this.bannerService.update(id, payload, updater);
    return DataResponse.ok(details);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(@Param('id') id: string) {
    const details = await this.bannerService.delete(id);
    return DataResponse.ok(details);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(@Query() req: BannerSearchRequest) {
    const list = await this.bannerSearchService.search(req);
    return DataResponse.ok(list);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(@Param('id') id: string) {
    const details = await this.bannerService.details(id);
    return DataResponse.ok(details);
  }
}
