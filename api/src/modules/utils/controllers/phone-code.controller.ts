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
import { PhoneCodeService } from '../services/phone-code.service';

@Injectable()
@Controller('phone-codes')
export class PhoneCodeController {
  constructor(private readonly phoneCodeService: PhoneCodeService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  list() {
    return DataResponse.ok(this.phoneCodeService.getList());
  }
}
