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
import { LanguageService } from '../services/language.service';

@Injectable()
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  list() {
    return DataResponse.ok(this.languageService.getList());
  }
}
