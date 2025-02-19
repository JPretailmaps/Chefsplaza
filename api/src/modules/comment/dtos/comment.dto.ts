import { Types } from 'mongoose';
import { pick } from 'lodash';

export class CommentDto {
  _id: Types.ObjectId;

  objectId?: Types.ObjectId;

  content?: string;

  createdBy?: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;

  creator?: any;

  object?: any;

  isAuth?: boolean;

  recipientId?: Types.ObjectId;

  objectType?: string;

  isLiked?: boolean;

  totalReply?: number;

  totalLike?: number;

  constructor(data?: Partial<CommentDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'objectId',
        'content',
        'createdBy',
        'createdAt',
        'updatedAt',
        'creator',
        'object',
        'isAuth',
        'recipientId',
        'objectType',
        'isLiked',
        'totalReply',
        'totalLike'
      ])
    );
  }
}
