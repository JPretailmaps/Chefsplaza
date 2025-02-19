import { Document, Types } from 'mongoose';

export class PerformerBlockUserModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  reason: string;

  target: string;

  targetId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
