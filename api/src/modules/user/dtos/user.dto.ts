import { Types } from 'mongoose';
import { pick } from 'lodash';
import { FileDto } from 'src/modules/file';

export class UserDto {
  _id: Types.ObjectId;

  name: string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  roles: string[] = ['user'];

  avatarId: Types.ObjectId;

  stats: {
    totalSubscriptions: number;
    following: number;
  };

  avatarPath: string;

  status: string;

  username: string;

  gender: string;

  balance: number;

  country: string; // iso code

  verifiedEmail: boolean;

  isOnline: boolean;

  twitterConnected: boolean;

  googleConnected: boolean;

  isPerformer?: boolean;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: Partial<any>) {
    data && Object.assign(
      this,
      pick(data, [
        '_id',
        'name',
        'firstName',
        'lastName',
        'email',
        'phone',
        'roles',
        'avatarId',
        'avatarPath',
        'status',
        'username',
        'gender',
        'balance',
        'country',
        'verifiedEmail',
        'isOnline',
        'stats',
        'twitterConnected',
        'googleConnected',
        'isPerformer',
        'createdAt',
        'updatedAt'
      ])
    );
  }

  getName() {
    if (this.name) return this.name;
    return [this.firstName || '', this.lastName || ''].join(' ');
  }

  toResponse(includePrivateInfo = false, isAdmin = false) {
    const publicInfo = {
      _id: this._id,
      name: this.getName(),
      avatar: FileDto.getPublicUrl(this.avatarPath),
      username: this.username,
      isOnline: this.isOnline,
      stats: this.stats,
      isPerformer: false,
      country: this.country,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } as any;

    const privateInfo = {
      twitterConnected: this.twitterConnected,
      googleConnected: this.googleConnected,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      status: this.status,
      gender: this.gender,
      balance: this.balance,
      roles: this.roles,
      verifiedEmail: this.verifiedEmail
    } as any;

    if (isAdmin) {
      return {
        ...publicInfo,
        ...privateInfo
      };
    }

    if (!includePrivateInfo) {
      return publicInfo;
    }

    return {
      ...publicInfo,
      ...privateInfo
    };
  }
}
