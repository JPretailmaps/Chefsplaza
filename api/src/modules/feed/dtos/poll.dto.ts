import { Types } from 'mongoose';
import { pick } from 'lodash';

export class PollDto {
  _id: Types.ObjectId | string;

  createdBy: Types.ObjectId | string;

  totalVote: number;

  expiredAt: Date;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(data?: Partial<PollDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'createdBy',
        'totalVote',
        'description',
        'expiredAt',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
