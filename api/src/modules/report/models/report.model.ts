import { Document, Types } from 'mongoose';

export class ReportModel extends Document {
  title: string;

  description: string;

  source: string;

  sourceId: Types.ObjectId;

  performerId: Types.ObjectId;

  target: string;

  targetId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
