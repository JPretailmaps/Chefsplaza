import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { STATUS } from 'src/kernel/constants';
import { BannerSearchRequest } from '../payloads';
import { BannerSearchService } from '../services';

@Injectable()
@Controller('site-promo')
export class BannerController {
  constructor(private readonly bannerSearchService: BannerSearchService) {}

  @Get('/search')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async search(@Query() req: BannerSearchRequest) {
    req.status = STATUS.ACTIVE;
    const list = await this.bannerSearchService.search(req);
    return DataResponse.ok(list);
  }
}
