import { Document, Types } from 'mongoose';

export class ScheduledStreamNotificationModel extends Document {
  feedId: Types.ObjectId;

  performerId: Types.ObjectId;

  notified: boolean;

  scheduledAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
