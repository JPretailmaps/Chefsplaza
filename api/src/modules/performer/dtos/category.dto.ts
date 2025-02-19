import { Types } from 'mongoose';
import { pick } from 'lodash';

export class PerformerCategoryDto {
  _id: Types.ObjectId;

  name: string;

  slug: string;

  ordering: number;

  description: string;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  constructor(data?: Partial<PerformerCategoryDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'name',
        'slug',
        'ordering',
        'description',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
