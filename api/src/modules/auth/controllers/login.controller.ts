import {
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Controller,
  HttpException,
  forwardRef,
  Inject,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services';
import { DataResponse } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import {
  STATUS_INACTIVE
} from 'src/modules/user/constants';
import { PerformerService } from 'src/modules/performer/services';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { AuthGooglePayload, AuthTwitterPayload, LoginByUsernamePayload } from '../payloads';
import { AuthService, SocialLoginService } from '../services';
import {
  PasswordIncorrectException,
  EmailNotVerifiedException,
  AccountInactiveException
} from '../exceptions';

@Controller('auth')
export class LoginController {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly socialLoginService: SocialLoginService
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async login(
    @Body() req: LoginByUsernamePayload
  ): Promise<DataResponse<{ token: string }>> {
    const query = {
      $or: [{
        email: req.username.toLowerCase()
      }, {
        username: req.username.toLowerCase()
      }]
    };

    let user = await this.userService.findOne(query);
    let source = 'user';
    if (!user) {
      user = await this.performerService.findOne(query) as any;
      source = 'performer';
    }
    if (!user) {
      throw new HttpException('This account is not found. Please sign up', 404);
    }
    const authPassword = await this.authService.findBySource({
      sourceId: user._id
    });
    if (!authPassword) {
      throw new HttpException('This account is not found. Please sign up', 404);
    }

    const requireEmailVerification = SettingService.getValueByKey(SETTING_KEYS.REQUIRE_EMAIL_VERIFICATION);
    if (requireEmailVerification && !user.verifiedEmail) {
      throw new EmailNotVerifiedException();
    }

    // allow model to login
    // if (performer && !performer.verifiedDocument) {
    //   throw new HttpException('Please wait for admin to verify your account, or you can contact admin by send message in contact page', 403);
    // }
    if (user.status === STATUS_INACTIVE) {
      throw new AccountInactiveException();
    }
    if (!this.authService.verifyPassword(req.password, authPassword)) {
      throw new PasswordIncorrectException();
    }

    const expiresIn = req.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1;
    const token = await this.authService.updateAuthSession(source, user._id, expiresIn);

    return DataResponse.ok({ token });
  }

  @Post('twitter/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async twitterLogin(
    @Body() payload: AuthTwitterPayload
  ): Promise<DataResponse<any>> {
    const resp = await this.socialLoginService.loginTwitter();
    return DataResponse.ok(resp);
  }

  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async googleLogin(
    @Body() payload: AuthGooglePayload
  ): Promise<DataResponse<any>> {
    const resp = await this.socialLoginService.verifyLoginGoogle(payload);
    return DataResponse.ok(resp);
  }

  @Post('google/token')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async getToken(
    @Body() payload: any
  ): Promise<DataResponse<any>> {
    const resp = await this.socialLoginService.getTokenGoogle(payload);
    return DataResponse.ok(resp);
  }

  @Post('twitter/callback')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @HttpCode(HttpStatus.OK)
  public async twitterCallback(
    @Body() payload: any
  ): Promise<DataResponse<any>> {
    const resp = await this.socialLoginService.twitterLoginCallback(payload);
    return DataResponse.ok(resp);
  }
}
