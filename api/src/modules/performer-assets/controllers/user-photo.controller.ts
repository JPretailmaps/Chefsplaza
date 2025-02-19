import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth';
import { LoadUser } from 'src/modules/auth/guards';
import { UserDto } from 'src/modules/user/dtos';
import { PhotoService } from '../services/photo.service';
import { PhotoSearchService } from '../services/photo-search.service';
import { PhotoSearchRequest } from '../payloads';
import { AuthService } from '../../auth/services';

@Injectable()
@Controller('performer-assets/photos')
export class UserPhotosController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly photoSearchService: PhotoSearchService,
    private readonly authService: AuthService
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoadUser)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() query: PhotoSearchRequest,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ) {
    const data = await this.photoSearchService.searchPhotos(query, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Get('/:id/view')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Param('id') id: string,
     @CurrentUser() user: UserDto,
     @Request() req: any
  ) {
    const details = await this.photoService.details(id, req.jwToken, user);
    return DataResponse.ok(details);
  }

  @Get('/auth/check')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async checkAuth(
    @Request() req: any
  ) {
    if (!req.query.token) throw new ForbiddenException();
    const decodded = await this.authService.verifySession(req.query.token);
    if (!decodded) throw new ForbiddenException();
    const user = await this.authService.getSourceFromAuthSession({
      source: decodded.source,
      sourceId: decodded.sourceId
    });
    if (!user) {
      throw new ForbiddenException();
    }
    const valid = await this.photoService.checkAuth(req, user);
    return DataResponse.ok(valid);
  }
}
