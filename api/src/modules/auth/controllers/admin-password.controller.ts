import {
  Body,
  Controller,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { AuthService } from '../services';
import { RoleGuard } from '../guards';
import { Roles } from '../decorators';
import { PasswordUserChangePayload } from '../payloads';

@Controller('admin/auth')
export class AdminPasswordController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Put('users/password')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async updateUserPassword(
    @Body() payload: PasswordUserChangePayload
  ): Promise<DataResponse<boolean>> {
    await this.authService.updateAuthPassword({
      source: payload.source || 'user',
      sourceId: payload.userId as any,
      value: payload.password
    });
    return DataResponse.ok(true);
  }
}
