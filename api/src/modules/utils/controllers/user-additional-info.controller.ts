import {
  HttpCode, HttpStatus, Controller, Get, Injectable, ValidationPipe, UsePipes
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { UserAdditionalInfoService } from '../services/user-additional-info.service';

@Injectable()
@Controller('user-additional')
export class UserAdditionalInfoController {
  constructor(private readonly userAdditionalInfoService: UserAdditionalInfoService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getBodyInfo() {
    return DataResponse.ok(this.userAdditionalInfoService.getBodyInfo());
  }
}
