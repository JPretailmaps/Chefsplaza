import { Document, Types } from 'mongoose';

export class ReactionModel extends Document {
  objectId: Types.ObjectId;

  action?: string;

  creator?: any;

  objectType?: string;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
