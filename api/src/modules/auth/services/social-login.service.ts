import {
  Injectable, Inject, forwardRef, HttpException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import {
  StringHelper
} from 'src/kernel';
import {
  STATUS_ACTIVE, GENDER_MALE
} from 'src/modules/user/constants';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { TwitterApi } from 'twitter-api-v2';
import { EmailHasBeenTakenException } from 'src/modules/user/exceptions';
import { OAuth2Client } from 'google-auth-library';
import { AuthErrorException } from '../exceptions';
import {
  OAUTH_LOGIN_MODEL_PROVIDER
} from '../providers/auth.provider';
import {
  OAuthLoginModel
} from '../models';
import { AuthCreateDto } from '../dtos';
import { AuthGooglePayload } from '../payloads';
import { AuthService } from './auth.service';

@Injectable()
export class SocialLoginService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(OAUTH_LOGIN_MODEL_PROVIDER)
    private readonly oAuthLoginModel: Model<OAuthLoginModel>,
    private readonly authService: AuthService
  ) {
  }

  public async loginTwitter(CALLBACK_URL = `${process.env.USER_URL}/auth/login`) {
    const CONSUMER_KEY = SettingService.getValueByKey(SETTING_KEYS.TWITTER_LOGIN_CLIENT_ID);
    const CONSUMER_SECRET = SettingService.getValueByKey(SETTING_KEYS.TWITTER_LOGIN_CLIENT_SECRET);
    const client = new TwitterApi({ appKey: CONSUMER_KEY, appSecret: CONSUMER_SECRET });
    try {
      const authLink = await client.generateAuthLink(CALLBACK_URL, { linkMode: 'authorize' });
      return authLink;
    } catch (e) {
      throw new HttpException('Invalid url!', 403);
    }
  }

  public async twitterLoginCallback(payload: Record<string, any>) {
    const {
      oauthToken,
      oauthTokenSecret,
      // eslint-disable-next-line camelcase
      oauth_verifier,
      role = 'user'
    } = payload;
    const CONSUMER_KEY = SettingService.getValueByKey(SETTING_KEYS.TWITTER_LOGIN_CLIENT_ID);
    const CONSUMER_SECRET = SettingService.getValueByKey(SETTING_KEYS.TWITTER_LOGIN_CLIENT_SECRET);
    const clientTwitter = new TwitterApi({
      appKey: CONSUMER_KEY,
      appSecret: CONSUMER_SECRET,
      accessToken: oauthToken,
      accessSecret: oauthTokenSecret
    });
    try {
      const {
        client
      } = await clientTwitter.login(oauth_verifier);
      const profile = await client.v1.verifyCredentials({ include_email: true, include_entities: true });
      const oauthModel = await this.oAuthLoginModel.findOne({
        provider: 'twitter',
        'value.user_id': profile.id_str
      });
      if (oauthModel) {
        const authUser = await this.authService.findBySource({
          source: role,
          sourceId: oauthModel.sourceId
        });
        if (!authUser) throw new AuthErrorException();
        const user = authUser.source === 'user' ? await this.userService.findById(authUser.sourceId) : await this.performerService.findById(authUser.sourceId);
        if (!user) throw new AuthErrorException();
        if (!user.email) {
          const [existsUser, existsPerformer] = await Promise.all([
            this.userService.checkExistedEmailorUsername({ email: profile.email }),
            this.performerService.checkExistedEmailorUsername({ email: profile.email })
          ]);
          if (!existsUser && !existsPerformer) {
            authUser.source === 'user' ? await this.userService.updateOne({ _id: user._id }, {
              email: profile.email,
              verifiedEmail: true
            }) : await this.performerService.updateOne({ _id: user._id }, {
              email: profile.email,
              verifiedEmail: true
            });
          }
        }
        const token = await this.authService.updateAuthSession(role, oauthModel.sourceId);
        return { token };
      }
      const data = {
        email: profile.email,
        verifiedEmail: !!profile.email,
        avatarPath: profile.profile_image_url_https,
        username: profile.screen_name,
        name: profile.name,
        status: STATUS_ACTIVE,
        gender: GENDER_MALE,
        twitterConnected: true,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any;
      const [existsUser, existsPerformer] = await Promise.all([
        this.userService.checkExistedEmailorUsername({ email: profile.email }),
        this.performerService.checkExistedEmailorUsername({ email: profile.email })
      ]);
      if (existsUser || existsPerformer) {
        throw new EmailHasBeenTakenException();
      }
      const newUser = role === 'user' ? await this.userService.socialCreate(data) : await this.performerService.socialCreate(data);

      await Promise.all([
        this.authService.createAuthPassword(
          new AuthCreateDto({
            source: role || 'user',
            sourceId: newUser._id,
            type: 'password',
            key: profile.email || profile.screen_name
          })
        ),
        this.oAuthLoginModel.create({
          source: role || 'user',
          sourceId: newUser._id,
          provider: 'twitter',
          value: {
            user_id: profile.id_str,
            screen_name: profile.screen_name,
            email: profile.email
            // todo - save accesstoken & secret
          },
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ]);
      const token = await this.authService.updateAuthSession(role, newUser._id);
      return { token };
    } catch (e) {
      throw new HttpException(e, 403);
    }
  }

  public async verifyLoginGoogle(payload: AuthGooglePayload) {
    const { tokenId, role = 'user' } = payload;
    const googleLoginClientId = SettingService.getValueByKey(SETTING_KEYS.GOOGLE_LOGIN_CLIENT_ID);
    const client = new OAuth2Client(
      SettingService.getValueByKey(SETTING_KEYS.GOOGLE_LOGIN_CLIENT_ID),
      SettingService.getValueByKey(SETTING_KEYS.GOOGLE_LOGIN_CLIENT_SECRET)
    );
    const resp = await client.verifyIdToken({
      idToken: tokenId,
      audience: googleLoginClientId
    }) as any;
    const { payload: profile } = resp;
    if (!profile.email) {
      throw new AuthErrorException();
    }
    const oauthModel = await this.oAuthLoginModel.findOne({
      provider: 'google',
      'value.email': profile.email
    });
    if (oauthModel) {
      const authUser = await this.authService.findBySource({
        source: role,
        sourceId: oauthModel.sourceId
      });
      if (!authUser) throw new AuthErrorException();
      const token = await this.authService.updateAuthSession(role, oauthModel.sourceId);
      return { token };
    }
    const [existsUser, existsPerformer] = await Promise.all([
      this.userService.checkExistedEmailorUsername({ email: profile.email }),
      this.performerService.checkExistedEmailorUsername({ email: profile.email })
    ]);
    if (existsUser || existsPerformer) {
      throw new EmailHasBeenTakenException();
    }
    const randomUsername = `user${StringHelper.randomString(8, '0123456789')}`;
    const data = {
      email: profile.email.toLowerCase(),
      firstName: profile?.given_name || '',
      lastName: profile.family_name,
      username: randomUsername,
      name: profile.name,
      avatarPath: profile?.picture || null,
      verifiedEmail: true,
      status: STATUS_ACTIVE,
      gender: GENDER_MALE,
      googleConnected: true
    };
    const newUser = role === 'user' ? await this.userService.socialCreate(data as any) : await this.performerService.socialCreate(data as any);

    await Promise.all([
      this.authService.createAuthPassword(
        new AuthCreateDto({
          source: role,
          sourceId: newUser._id,
          type: 'password',
          key: profile.email
        })
      ),
      this.oAuthLoginModel.create({
        source: role,
        sourceId: newUser._id,
        provider: 'google',
        value: profile,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ]);

    const token = await this.authService.updateAuthSession(role, newUser._id);
    return { token };
  }

  public async getTokenGoogle(payload: any) {
    const { code, role = 'user' } = payload;
    const client = new OAuth2Client(
      SettingService.getValueByKey(SETTING_KEYS.GOOGLE_LOGIN_CLIENT_ID),
      SettingService.getValueByKey(SETTING_KEYS.GOOGLE_LOGIN_CLIENT_SECRET),
      'postmessage'
    );
    const { tokens } = await client.getToken(code);
    return this.verifyLoginGoogle({
      tokenId: tokens.id_token,
      role
    });
  }
}
