import { Document, Types } from 'mongoose';

export class CategoryModel extends Document {
  name: string;

  slug: string;

  ordering: number;

  description: string;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
