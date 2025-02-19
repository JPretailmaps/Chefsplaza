/* eslint-disable no-param-reassign */
import {
  Injectable, Inject, forwardRef, ForbiddenException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { FileDto } from 'src/modules/file';
import {
  EntityNotFoundException, StringHelper, QueueEventService,
  QueueEvent
} from 'src/kernel';
import { EVENT, STATUS } from 'src/kernel/constants';
import { AuthService } from 'src/modules/auth/services';
import { PerformerService } from 'src/modules/performer/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { omit } from 'lodash';
import { REF_TYPE } from 'src/modules/file/constants';
import { FileService } from 'src/modules/file/services';
import { UserModel } from '../models';
import { USER_MODEL_PROVIDER } from '../providers';
import {
  UserUpdatePayload, UserCreatePayload, AdminUpdatePayload, UserRegisterPayload
} from '../payloads';
import { UserDto } from '../dtos';
import {
  DELETE_USER_CHANNEL, ROLE_USER, STATUS_ACTIVE
} from '../constants';
import { EmailHasBeenTakenException } from '../exceptions';
import { UsernameExistedException } from '../exceptions/username-existed.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(USER_MODEL_PROVIDER)
    private readonly userModel: Model<UserModel>,
    private readonly queueEventService: QueueEventService,
    private readonly fileService: FileService
  ) {}

  public async find(params: any): Promise<UserModel[]> {
    return this.userModel.find(params);
  }

  public async findOne(params: any): Promise<UserModel> {
    return this.userModel.findOne(params);
  }

  public async updateOne(query: any, params: any, options = {}): Promise<any> {
    return this.userModel.updateOne(query, params, options);
  }

  public async updateMany(query: any, params: any, options: any): Promise<any> {
    return this.userModel.updateMany(query, params, options);
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    if (!email) {
      return null;
    }
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  public async findById(id: string | Types.ObjectId): Promise<UserModel> {
    return this.userModel.findById(id);
  }

  public async getMe(id: string, jwToken: string): Promise<any> {
    const user = await this.userModel.findById(id);
    if (user) {
      return new UserDto(user).toResponse(true);
    }
    const performer = await this.performerService.getDetails(id, jwToken);
    if (!performer && !user) {
      throw new EntityNotFoundException();
    }
    return new PerformerDto(performer).toResponse(true);
  }

  public async findByUsername(username: string): Promise<UserDto> {
    const newUsername = username.trim().toLowerCase();
    const user = await this.userModel.findOne({ username: newUsername });
    return user ? new UserDto(user) : null;
  }

  public async findByIds(ids: any[]): Promise<UserDto[]> {
    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
    return users.map((u) => new UserDto(u));
  }

  public async checkExistedEmailorUsername(payload) {
    const data = payload.username ? await this.userModel.countDocuments({ username: payload.username.trim().toLowerCase() })
      : await this.userModel.countDocuments({ email: payload.email.toLowerCase() });
    return data;
  }

  public async register(data: UserRegisterPayload): Promise<UserModel> {
    if (!data || !data.email) {
      throw new EntityNotFoundException();
    }
    // check exited email in user & performer
    data.email = data.email.toLowerCase();
    const [countUserEmail, countPerformerEmail] = await Promise.all([
      this.userModel.countDocuments({
        email: data.email
      }),
      this.performerService.checkExistedEmailorUsername({ email: data.email })
    ]);
    if (countUserEmail || countPerformerEmail) {
      throw new EmailHasBeenTakenException();
    }
    // check exited username in user & performer
    data.username = (data?.username || `user${StringHelper.randomString(12, '0123456789')}`).trim().toLowerCase();
    const [countUserUsername, countPerformerUsername] = await Promise.all([
      data.username && this.findByUsername(data.username),
      data.username && this.performerService.checkExistedEmailorUsername({ username: data.username })
    ]);
    if (countUserUsername || countPerformerUsername) {
      throw new UsernameExistedException();
    }
    const user = { ...data } as any;
    user.balance = 0;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.status = STATUS_ACTIVE;
    user.roles = [ROLE_USER];
    if (!user.name) {
      user.name = [user.firstName || '', user.lastName || ''].join(' ');
    }
    return this.userModel.create(user);
  }

  // admin create
  public async create(data: UserCreatePayload): Promise<UserModel> {
    if (!data || !data.email) {
      throw new EntityNotFoundException();
    }
    // check exited email in user & performer
    data.email = data.email.toLowerCase();
    const [countUserEmail, countPerformerEmail] = await Promise.all([
      this.userModel.countDocuments({
        email: data.email
      }),
      this.performerService.checkExistedEmailorUsername({ email: data.email })
    ]);
    if (countUserEmail || countPerformerEmail) {
      throw new EmailHasBeenTakenException();
    }
    // check exited username in user & performer
    data.username = (data?.username || `user${StringHelper.randomString(12, '0123456789')}`).trim().toLowerCase();
    const [countUserUsername, countPerformerUsername] = await Promise.all([
      data.username && this.findByUsername(data.username),
      data.username && this.performerService.checkExistedEmailorUsername({ username: data.username })
    ]);
    if (countUserUsername || countPerformerUsername) {
      throw new UsernameExistedException();
    }
    const user = { ...data } as any;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.status = STATUS_ACTIVE;

    if (!user.name) {
      user.name = user.firstName && user.lastName ? [user.firstName || '', user.lastName || ''].join(' ') : 'Unknown';
    }
    return this.userModel.create(user);
  }

  public async socialCreate(payload): Promise<UserModel> {
    const data = omit({
      ...payload,
      updatedAt: new Date(),
      createdAt: new Date()
    }, ['balance', 'roles']) as any;

    // check exited username in user & performer
    const [countUserUsername, countPerformerUsername] = await Promise.all([
      this.findByUsername(data.username),
      this.performerService.checkExistedEmailorUsername({ username: data.username })
    ]);
    if (countUserUsername || countPerformerUsername) {
      data.username = `user${new Date().getTime()}`;
    }
    data.roles = [ROLE_USER];
    data.balance = 0;
    return this.userModel.create(data);
  }

  // self update
  public async update(id: string | Types.ObjectId, payload: UserUpdatePayload, user: UserDto): Promise<any> {
    const data = omit({
      ...payload,
      updatedAt: new Date()
    }, ['balance', 'roles']) as any;
    if (`${user._id}` !== `${id}`) {
      throw new ForbiddenException();
    }
    if (!data.name) {
      // eslint-disable-next-line no-param-reassign
      data.name = (data.firstName && data.lastName && [data.firstName || '', data.lastName || ''].join(' ')) || data.username || 'Unknown';
    }

    if (data.username) {
      data.username = (data.username || '').trim().toLowerCase();
      if (data.username !== user.username) {
        const [countUserUsername, countPerformerUsername] = await Promise.all([
          this.userModel.countDocuments({
            username: data.username,
            _id: { $ne: user._id }
          }),
          this.performerService.checkExistedEmailorUsername({ username: data.username })
        ]);
        if (countUserUsername || countPerformerUsername) {
          throw new UsernameExistedException();
        }
      }
    }
    if (data.email) {
      data.email = (data.email || '').toLowerCase();
      if (data.email !== user.email) {
        const [countUserEmail, countPerformerEmail] = await Promise.all([
          this.userModel.countDocuments({
            email: data.email,
            _id: { $ne: user._id }
          }),
          this.performerService.checkExistedEmailorUsername({ email: data.email })
        ]);
        if (countUserEmail || countPerformerEmail) {
          throw new EmailHasBeenTakenException();
        }
        data.verifiedEmail = false;
      }
    }
    await this.userModel.updateOne({ _id: id }, data);
    if (data.email && data.email !== user.email) {
      data.email = data.email.toLowerCase();
      if (data.email !== user.email) {
        await this.authService.sendVerificationEmail({ _id: user._id, email: data.email });
        await this.authService.updateKey({
          source: 'user',
          sourceId: user._id,
          key: data.email
        });
      }
    }
    return user;
  }

  public async adminUpdate(id: string | Types.ObjectId, payload: AdminUpdatePayload): Promise<any> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new EntityNotFoundException();
    }

    const data = { ...payload };
    if (!data.name) {
      // eslint-disable-next-line no-param-reassign
      data.name = (data.firstName && data.lastName && [data.firstName || '', data.lastName || ''].join(' ')) || data.username || 'Unknown';
    }
    if (data.username) {
      data.username = (data.username || '').trim().toLowerCase();
      if (data.username !== user.username) {
        const [countUserUsername, countPerformerUsername] = await Promise.all([
          this.userModel.countDocuments({
            username: data.username,
            _id: { $ne: user._id }
          }),
          this.performerService.checkExistedEmailorUsername({ username: data.username })
        ]);
        if (countUserUsername || countPerformerUsername) {
          throw new UsernameExistedException();
        }
      }
    }
    if (data.email) {
      data.email = (data.email || '').toLowerCase();
      if (data.email !== user.email) {
        const [countUserEmail, countPerformerEmail] = await Promise.all([
          this.userModel.countDocuments({
            email: data.email,
            _id: { $ne: user._id }
          }),
          this.performerService.checkExistedEmailorUsername({ email: data.email })
        ]);
        if (countUserEmail || countPerformerEmail) {
          throw new EmailHasBeenTakenException();
        }
        data.verifiedEmail = false;
      }
    }
    await this.userModel.updateOne({ _id: id }, data);
    const newUser = await this.userModel.findById(id);
    if (data.email && data.email !== user.email) {
      data.email = data.email.toLowerCase();
      if (data.email !== user.email) {
        await this.authService.sendVerificationEmail({ _id: user._id, email: data.email });
        await this.authService.updateKey({
          source: 'user',
          sourceId: user._id,
          key: data.email
        });
      }
    }
    return newUser;
  }

  public async updateAvatar(user: UserDto, file: FileDto) {
    await this.userModel.updateOne(
      { _id: user._id },
      {
        avatarId: file._id,
        avatarPath: file.path
      }
    );
    await this.fileService.addRef(file._id, {
      itemId: user._id,
      itemType: REF_TYPE.USER
    });
    if (user.avatarId && `${user.avatarId}` !== `${file._id}`) {
      await this.fileService.remove(user.avatarId);
    }
    return file;
  }

  public async updateVerificationStatus(userId: string | Types.ObjectId): Promise<any> {
    return this.userModel.updateOne(
      {
        _id: userId
      },
      { status: STATUS.ACTIVE, verifiedEmail: true, updatedAt: new Date() }
    );
  }

  public async updateStats(
    id: string | Types.ObjectId,
    payload: Record<string, number>
  ) {
    await this.userModel.updateOne({ _id: id }, { $inc: payload });
  }

  public async updateCCbillPaymentInfo(userId: | Types.ObjectId, subscriptionId: string) {
    await this.userModel.updateOne({ _id: userId }, { ccbillCardToken: subscriptionId, authorisedCard: true });
  }

  public async updateBalance(userId: string | Types.ObjectId, num: number) {
    await this.userModel.updateOne({ _id: userId }, { $inc: { balance: num } });
  }

  public async delete(id: string) {
    if (!StringHelper.isObjectId(id)) throw new ForbiddenException();
    const user = await this.userModel.findById(id);
    if (!user) throw new EntityNotFoundException();
    await this.userModel.deleteOne({ _id: id });
    await this.queueEventService.publish(new QueueEvent({
      channel: DELETE_USER_CHANNEL,
      eventName: EVENT.DELETED,
      data: new UserDto(user)
    }));
    return { deleted: true };
  }
}
