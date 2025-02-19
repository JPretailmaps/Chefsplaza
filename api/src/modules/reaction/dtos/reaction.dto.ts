import { Types } from 'mongoose';
import { pick } from 'lodash';

export class ReactionDto {
  _id?: Types.ObjectId;

  source?: string;

  action?: string;

  objectId?: Types.ObjectId;

  objectInfo?: any;

  objectType?: string;

  createdBy?: string | Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;

  creator?: any;

  constructor(data?: Partial<ReactionDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'source',
        'action',
        'objectId',
        'objectInfo',
        'objectType',
        'createdBy',
        'creator',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
