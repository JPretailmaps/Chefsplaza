import { Schema } from 'mongoose';

export const ScheduledStreamNotificationSchema = new Schema({
  feedId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  performerId: {
    type: Schema.Types.ObjectId,
    index: true
  },
  scheduledAt: {
    type: Date,
    index: -1
  },
  notified: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'scheduled-streaming-notifications'
});
