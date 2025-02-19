import { Schema, Types } from 'mongoose';

export const VideoSchema = new Schema({
  performerId: {
    type: Types.ObjectId,
    index: true
  },
  participantIds: [
    { index: true, type: String }
  ],
  fileId: Types.ObjectId,
  type: {
    type: String,
    index: true
  },
  title: {
    type: String
    // TODO - text index?
  },
  slug: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true
  },
  description: String,
  status: {
    type: String,
    default: 'active'
  },
  tags: [
    { type: String, index: true }
  ],
  isSchedule: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  processing: Boolean,
  teaserProcessing: Boolean,
  thumbnailId: Types.ObjectId,
  teaserId: Types.ObjectId,
  stats: {
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  scheduledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
