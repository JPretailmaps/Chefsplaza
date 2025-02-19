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
  Request,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, getConfig } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { MultiFileUploadInterceptor, FilesUploaded } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { S3ObjectCannelACL, Storage } from 'src/modules/storage/contants';
import { PhotoCreatePayload, PhotoUpdatePayload, PhotoSearchRequest } from '../payloads';
import { PhotoService } from '../services/photo.service';
import { PhotoSearchService } from '../services/photo-search.service';

@Injectable()
@Controller('admin/performer-assets/photos')
export class AdminPerformerPhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly photoSearchService: PhotoSearchService
  ) {}

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseInterceptors(
    // TODO - check and support multiple files!!!
    MultiFileUploadInterceptor([
      {
        type: 'performer-photo',
        fieldName: 'photo',
        options: {
          destination: getConfig('file').photoProtectedDir,
          acl: S3ObjectCannelACL.AuthenticatedRead,
          server: Storage.S3
        }
      }
    ])
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async upload(
    @FilesUploaded() files: Record<string, any>,
    @Body() payload: PhotoCreatePayload,
    @CurrentUser() creator: UserDto
  ): Promise<any> {
    const resp = await this.photoService.create(
      files.photo,
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
    @Body() payload: PhotoUpdatePayload,
    @CurrentUser() updater: UserDto
  ) {
    const details = await this.photoService.updateInfo(id, payload, updater);
    return DataResponse.ok(details);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(@Param('id') id: string) {
    const details = await this.photoService.delete(id);
    return DataResponse.ok(details);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() query: PhotoSearchRequest,
    @Request() req: any
  ) {
    const details = await this.photoSearchService.adminSearch(query, req.jwToken);
    return DataResponse.ok(details);
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ) {
    const details = await this.photoService.details(id, req.jwToken, user);
    return DataResponse.ok(details);
  }
}
