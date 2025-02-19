import { Types } from 'mongoose';
import { pick } from 'lodash';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';

export class FollowDto {
  _id: Types.ObjectId;

  followerId: Types.ObjectId;

  followingId: Types.ObjectId;

  followerInfo?: UserDto;

  followingInfo?: PerformerDto;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: Partial<FollowDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'followerId',
        'followingId',
        'followerInfo',
        'followingInfo',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
