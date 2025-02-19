import { Types } from 'mongoose';
import { pick } from 'lodash';

export class ReportDto {
  _id: Types.ObjectId;

  title: string;

  description: string;

  source: string;

  sourceId: Types.ObjectId;

  sourceInfo?: any;

  performerId: Types.ObjectId;

  performerInfo?: any;

  target: string;

  targetId: Types.ObjectId;

  targetInfo?: any;

  createdAt: Date;

  updatedAt: Date;

  constructor(data?: Partial<ReportDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'title',
        'description',
        'source',
        'sourceId',
        'sourceInfo',
        'performerId',
        'performerInfo',
        'target',
        'targetId',
        'targetInfo',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
