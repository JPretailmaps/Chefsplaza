import {
  HttpCode,
  HttpStatus,
  Controller,
  Injectable,
  UseGuards,
  Post,
  Delete,
  Param,
  Body,
  Get,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { BlockService } from '../services';
import { BlockCountryCreatePayload } from '../payloads/site-block-country.payload';

@Injectable()
@Controller('admin/block')
export class AdminBlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get('/countries')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(): Promise<DataResponse<any>> {
    const search = await this.blockService.search();
    return DataResponse.ok(search);
  }

  @Post('/countries')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createUser(
    @Body() payload: BlockCountryCreatePayload
  ): Promise<DataResponse<any>> {
    const resp = await this.blockService.create(payload);

    return DataResponse.ok(resp);
  }

  @Delete('/countries/:code')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(@Param('code') countryCode: string): Promise<DataResponse<boolean>> {
    const deleted = await this.blockService.delete(countryCode);
    return DataResponse.ok(deleted);
  }
}
