import { Document, Types } from 'mongoose';

export class PollModel extends Document {
  description: string;

  createdBy: Types.ObjectId;

  fromRef: string;

  refId: Types.ObjectId;

  totalVote?: number;

  expiredAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
