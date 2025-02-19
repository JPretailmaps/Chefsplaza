import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  Put,
  UseGuards,
  Inject,
  forwardRef,
  HttpException,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  Res
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { DataResponse } from 'src/kernel';
import moment = require('moment');
import { AuthService } from '../services';
import { AuthGuard } from '../guards';
import { CurrentUser } from '../decorators';
import { PasswordChangePayload, ForgotPayload } from '../payloads';
import { AccountNotFoundxception } from '../exceptions';

const md5 = require('md5');

@Controller('auth')
export class PasswordController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    private readonly authService: AuthService
  ) {}

  @Put('users/me/password')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async updatePassword(
    @CurrentUser() user: UserDto,
    @Body() payload: PasswordChangePayload
  ): Promise<DataResponse<boolean>> {
    await this.authService.updateAuthPassword({
      source: payload.source || 'user',
      sourceId: user._id as any,
      value: payload.password
    });
    return DataResponse.ok(true);
  }

  @Post('users/forgot')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async forgotPassword(
    @Body() req: ForgotPayload
  ): Promise<DataResponse<{ success: boolean }>> {
    let user = await this.userService.findByEmail(req.email.toLowerCase());
    if (!user) {
      user = await this.performerService.findByEmail(req.email.toLowerCase()) as any;
    }
    if (!user) {
      throw new HttpException('Sorry, we couldn\'t find your account. Please recheck the email entered', 404);
    }
    const authPassword = await this.authService.findBySource({
      sourceId: user._id
      // type: 'password'
    });
    if (!authPassword) {
      throw new AccountNotFoundxception();
    }

    await this.authService.forgot(authPassword, {
      _id: user._id,
      email: user.email
    });

    return DataResponse.ok({
      success: true
    });
  }

  @Get('password-change')
  public async renderUpdatePassword(
    @Res() res: Response,
    @Query('token') token: string
  ) {
    if (!token) {
      return res.render('404.html');
    }

    const forgot = await this.authService.getForgot(token);
    if (!forgot) {
      return res.render('404.html');
    }
    if (moment(forgot.createdAt).isAfter(moment().add(1, 'day'))) {
      await this.authService.removeForgot(forgot._id);
      return res.render('404.html');
    }

    return res.render('password-change.html');
  }

  @Post('password-change')
  public async updatePasswordForm(
    @Res() res: Response,
    @Query('token') token: string,
    @Body('password') password: string
  ) {
    if (!token || !password || password.length < 6) {
      return res.render('404.html');
    }

    const forgot = await this.authService.getForgot(token);
    if (!forgot) {
      return res.render('404.html');
    }
    const pw = process.env.HASH_PW_CLIENT === 'true' ? md5(password) : password;
    await this.authService.updateAuthPassword({
      source: forgot.source,
      sourceId: forgot.sourceId,
      value: pw
    });
    await this.authService.removeForgot(forgot._id);
    // TODO - should remove other forgot link?
    return res.render('password-change.html', {
      done: true
    });
  }
}
