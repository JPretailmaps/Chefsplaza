import {
  Injectable, Inject, forwardRef
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import {
  StringHelper, EntityNotFoundException, getConfig
} from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { randomString } from 'src/kernel/helpers/string.helper';
import * as moment from 'moment';
import {
  AUTH_MODEL_PROVIDER, FORGOT_MODEL_PROVIDER, VERIFICATION_MODEL_PROVIDER, OAUTH_LOGIN_MODEL_PROVIDER, AUTH_SESSION_MODEL_PROVIDER
} from '../providers/auth.provider';
import {
  AuthModel, ForgotModel, VerificationModel, OAuthLoginModel, AuthSessionModel
} from '../models';
import { AuthCreateDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(OAUTH_LOGIN_MODEL_PROVIDER)
    private readonly oAuthLoginModel: Model<OAuthLoginModel>,
    @Inject(AUTH_MODEL_PROVIDER)
    private readonly authModel: Model<AuthModel>,
    @Inject(VERIFICATION_MODEL_PROVIDER)
    private readonly verificationModel: Model<VerificationModel>,
    @Inject(FORGOT_MODEL_PROVIDER)
    private readonly forgotModel: Model<ForgotModel>,
    @Inject(AUTH_SESSION_MODEL_PROVIDER)
    private readonly authSessionModel: Model<AuthSessionModel>,
    private readonly mailService: MailerService
  ) {
  }

  /**
   * generate password salt
   * @param byteSize integer
   */
  public generateSalt(byteSize = 16): string {
    return crypto.randomBytes(byteSize).toString('base64');
  }

  public encryptPassword(pw: string, salt: string): string {
    const defaultIterations = 10000;
    const defaultKeyLength = 64;

    return crypto.pbkdf2Sync(pw || '', salt, defaultIterations, defaultKeyLength, 'sha1').toString('base64');
  }

  public async findOne(query: any) {
    const data = await this.authModel.findOne(query);
    return data;
  }

  public async find(query: any) {
    const data = await this.authModel.find(query);
    return data;
  }

  public async createAuthPassword(data: AuthCreateDto): Promise<AuthModel> {
    const salt = this.generateSalt();
    const newVal = data.value && this.encryptPassword(data.value, salt);

    // avoid admin update
    // TODO - should listen via user event?
    let auth = await this.authModel.findOne({
      type: 'password',
      sourceId: data.sourceId
    });
    if (!auth) {
      // eslint-disable-next-line new-cap
      auth = new this.authModel({
        type: 'password',
        source: data.source,
        sourceId: data.sourceId
      });
    }

    auth.salt = salt;
    auth.value = newVal;
    auth.key = data.key;

    return auth.save();
  }

  public async updateAuthPassword(data: AuthCreateDto) {
    const user = data.source === 'user'
      ? await this.userService.findById(data.sourceId)
      : await this.performerService.findById(data.sourceId);
    if (!user) {
      throw new EntityNotFoundException();
    }
    await this.createAuthPassword({
      source: data.source,
      sourceId: data.sourceId,
      key: user.email || user?.username,
      value: data.value
    });
  }

  public async updateKey(data: AuthCreateDto) {
    const auths = await this.authModel.find({
      source: data.source,
      sourceId: data.sourceId
    });

    await Promise.all(
      auths.map((auth) => {
        // eslint-disable-next-line no-param-reassign
        auth.key = data.key;
        return auth.save();
      })
    );
  }

  public async findBySource(options: {
    source?: string;
    sourceId?: Types.ObjectId;
    type?: string;
    key?: string;
  }): Promise<AuthModel | null> {
    return this.authModel.findOne(options);
  }

  public verifyPassword(pw: string, auth: AuthModel): boolean {
    if (!pw || !auth || !auth.salt) {
      return false;
    }
    const encryptPassword = this.encryptPassword(pw, auth.salt);
    return encryptPassword === auth.value;
  }

  public async getSourceFromAuthSession(auth: { source: string, sourceId: Types.ObjectId }): Promise<any> {
    if (auth.source === 'user') {
      const user = await this.userService.findById(auth.sourceId);
      return new UserDto(user).toResponse(true);
    }
    if (auth.source === 'performer') {
      const user = await this.performerService.findById(auth.sourceId);
      return new PerformerDto(user).toResponse(true);
    }

    return null;
  }

  public async getForgot(token: string): Promise<ForgotModel> {
    return this.forgotModel.findOne({ token });
  }

  public async removeForgot(id: string) {
    await this.forgotModel.deleteOne({ _id: id });
  }

  public async forgot(
    auth: AuthModel,
    source: {
      _id: Types.ObjectId;
      email: string;
    }
  ) {
    const token = StringHelper.randomString(14);
    await this.forgotModel.create({
      token,
      source: auth.source,
      sourceId: source._id,
      authId: auth._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const forgotLink = new URL(`auth/password-change?token=${token}`, getConfig('app').baseUrl).href;
    await this.mailService.send({
      subject: 'Recover password',
      to: source.email,
      data: {
        forgotLink
      },
      template: 'forgot'
    });
    return true;
  }

  public async sendVerificationEmail(source: any): Promise<void> {
    const verifications = await this.verificationModel.find({
      sourceId: source._id,
      value: source.email.toLowerCase()
    });
    const token = StringHelper.randomString(15);
    if (!verifications.length) {
      await this.verificationModel.create({
        sourceId: source._id,
        sourceType: 'user',
        value: source.email,
        token
      });
      await this.verificationModel.create({
        sourceId: source._id,
        sourceType: 'performer',
        value: source.email,
        token
      });
    }
    if (verifications.length) {
      const ids = verifications.map((v) => v._id);
      await this.verificationModel.updateMany({ _id: { $in: ids } }, { $set: { token, updatedAt: new Date() } });
    }
    const verificationLink = new URL(`auth/email-verification?token=${token}`, getConfig('app').baseUrl).href;
    const siteName = SettingService.getValueByKey(SETTING_KEYS.SITE_NAME) || process.env.DOMAIN;
    await this.mailService.send({
      to: source.email,
      subject: 'Verify your email address',
      data: {
        name: source?.name || source?.username || 'there',
        verificationLink,
        siteName
      },
      template: 'email-verification'
    });
  }

  public async verifyEmail(token: string): Promise<void> {
    const verifications = await this.verificationModel.find({
      token
    });
    if (!verifications || !verifications.length) {
      throw new EntityNotFoundException();
    }
    await Promise.all(
      verifications.map(async (verification) => {
        // eslint-disable-next-line no-param-reassign
        verification.verified = true;
        // eslint-disable-next-line no-param-reassign
        verification.updatedAt = new Date();
        await verification.save();
        if (verification.sourceType === 'user') {
          await this.userService.updateVerificationStatus(verification.sourceId);
        }
        if (verification.sourceType === 'performer') {
          await this.performerService.updateVerificationStatus(verification.sourceId);
        }
      })
    );
  }

  public async updateAuthSession(source: string, sourceId: string | Types.ObjectId, expiresInSeconds = 60 * 60 * 24) {
    const session = await this.authSessionModel.findOne({
      sourceId
    });
    const expiryAt = moment().add(expiresInSeconds, 'seconds').toDate();
    if (session) {
      await this.authSessionModel.updateOne({
        _id: session._id
      }, {
        $set: {
          expiryAt
        }
      });
      return session.token;
    }

    const token = randomString(15);
    await this.authSessionModel.create({
      source,
      sourceId,
      token,
      expiryAt,
      createdAt: new Date()
    });

    return token;
  }

  public async verifySession(token: string) {
    const session = await this.authSessionModel.findOne({ token }).lean();
    if (!session || moment().isAfter(new Date(session.expiryAt))) {
      return false;
    }
    return session;
  }
}
