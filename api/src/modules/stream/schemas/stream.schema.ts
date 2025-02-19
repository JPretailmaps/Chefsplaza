import { Schema, Types } from 'mongoose';

export const StreamSchema = new Schema({
  performerId: { type: Types.ObjectId, index: true },
  type: { type: String, index: true },
  sessionId: { type: String, index: true },
  isStreaming: { type: Number, default: 0 },
  lastStreamingTime: Date,
  streamingTime: {
    type: Number,
    default: 0
  },
  stats: {
    members: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  isFree: {
    type: Boolean,
    default: false,
    index: true
  },
  price: {
    type: Number,
    default: 0
  },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  conversationId: { type: Types.ObjectId, index: true }
});

StreamSchema.index({
  type: 1,
  conversationId: 1,
  isFree: 1
});
