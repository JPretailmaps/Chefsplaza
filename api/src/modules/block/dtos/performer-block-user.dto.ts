import { Types } from 'mongoose';
import { pick } from 'lodash';

export class PerformerBlockUserDto {
  _id: Types.ObjectId;

  source: string;

  sourceId: Types.ObjectId;

  target: string;

  targetId: Types.ObjectId;

  reason: string;

  targetInfo?: any;

  createdAt: Date;

  updatedAt: Date;

  constructor(data?: Partial<PerformerBlockUserDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'source',
        'sourceId',
        'reason',
        'target',
        'targetId',
        'targetInfo',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
