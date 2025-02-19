import { Document, Types } from 'mongoose';

export class MessageModel extends Document {
  conversationId: Types.ObjectId;

  type: string;

  fileId?: Types.ObjectId;

  fileIds: Types.ObjectId[];

  text: string;

  senderSource: string;

  senderId: Types.ObjectId;

  meta?: any;

  createdAt?: Date;

  updatedAt?: Date;
}
