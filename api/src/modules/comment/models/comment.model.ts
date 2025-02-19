import { Document, Types } from 'mongoose';

export class CommentModel extends Document {
  objectId: Types.ObjectId;

  content?: string;

  creator?: any;

  objectType?: string;

  recipientId: Types.ObjectId;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  totalReply: number;

  totalLike: number;
}
