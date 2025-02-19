import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CountryService } from 'src/modules/utils/services';
import { BlockService } from '../services';

@Injectable()
@Controller('block')
export class BlockController {
  constructor(
    private readonly blockService: BlockService,
    private readonly countryService: CountryService

  ) {}

  @Get('/countries/check')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async blockCountry(@Request() req: any): Promise<DataResponse<any>> {
    let ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // eslint-disable-next-line prefer-destructuring
    ipAddress = ipAddress.split(',')[0];
    let userCountry = null;
    const countryCode = req.headers['cf-ipcountry'] || null;
    if (countryCode) {
      const check = await this.blockService.checkCountryBlock(countryCode);
      return DataResponse.ok(check);
    }
    if (!ipAddress.includes('127.0.0.1') && !countryCode) {
      try {
        userCountry = await this.countryService.findCountryByIP(ipAddress) as any;
        if (userCountry && userCountry.status === 'success' && userCountry.countryCode) {
          const check = await this.blockService.checkCountryBlock(userCountry.countryCode);
          return DataResponse.ok(check);
        }
      } catch (e) {
        return DataResponse.ok({ blocked: false });
      }
    }
    return DataResponse.ok({ blocked: false });
  }
}
