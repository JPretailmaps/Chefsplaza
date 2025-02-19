import { Types } from 'mongoose';
import { pick } from 'lodash';

export class MessageDto {
  _id: Types.ObjectId;

  conversationId: Types.ObjectId;

  type: string;

  fileId: Types.ObjectId;

  fileIds: Types.ObjectId[];

  files:any;

  text: string;

  senderId: Types.ObjectId;

  meta: any;

  createdAt: Date;

  updatedAt: Date;

  fileUrl?: string;

  senderInfo?: any;

  constructor(data?: Partial<MessageDto>) {
    Object.assign(this, pick(data, [
      '_id',
      'conversationId',
      'type',
      'fileId',
      'fileIds',
      'files',
      'imageUrl',
      'senderInfo',
      'text',
      'senderId',
      'meta',
      'createdAt',
      'updatedAt'
    ]));
  }
}
