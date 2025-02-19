import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CountryService } from '../services/country.service';

@Injectable()
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  list() {
    return DataResponse.ok(this.countryService.getList());
  }
}
