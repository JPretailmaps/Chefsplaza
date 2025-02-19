import { Schema, Types } from 'mongoose';

export const BannerSchema = new Schema({
  // original file
  fileId: Types.ObjectId,
  title: {
    type: String
    // TODO - text index?
  },
  link: String,
  description: { type: String },
  processing: Boolean,
  status: {
    type: String,
    // draft, active, pending, file-error
    default: 'active'
  },
  position: { type: String, default: 'top' },
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
