import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
  forwardRef,
  ValidationPipe,
  UsePipes,
  ForbiddenException
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { AuthGuard, LoadUser } from 'src/modules/auth/guards';
import { CurrentUser } from 'src/modules/auth';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { ProductService } from '../services/product.service';
import { ProductSearchService } from '../services/product-search.service';
import { ProductSearchRequest } from '../payloads';

@Injectable()
@Controller('performer-assets/products')
export class UserProductsController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly productSearchService: ProductSearchService
  ) {}

  @Get('/search')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: ProductSearchRequest
  ) {
    const resp = await this.productSearchService.userSearch(req);
    const data = resp.data.map((d) => d.toPublic());
    return DataResponse.ok({
      total: resp.total,
      data
    });
  }

  @Get('/:id')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Param('id') id: string,
    @CurrentUser() user: UserDto
  ) {
    const details = await this.productService.userGetDetails(id, user);
    return DataResponse.ok(details.toPublic());
  }

  @Get('/:id/download-link')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getDownloadLink(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ) {
    const downloadLink = await this.productService.generateDownloadLink(id, user, req.jwToken);
    return DataResponse.ok({
      downloadLink
    });
  }

  @Get('/auth/check')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async checkAuth(
    @Request() request: any
  ) {
    if (!request.query.token) throw new ForbiddenException();
    const decodded = await this.authService.verifySession(request.query.token);
    if (!decodded) throw new ForbiddenException();
    const user = await this.authService.getSourceFromAuthSession({
      source: decodded.source,
      sourceId: decodded.sourceId
    });
    if (!user) {
      throw new ForbiddenException();
    }
    const valid = await this.productService.checkAuth(request, user);
    return DataResponse.ok(valid);
  }
}
