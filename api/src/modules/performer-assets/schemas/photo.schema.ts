import { Schema, Types } from 'mongoose';

export const PhotoSchema = new Schema({
  performerId: {
    type: Types.ObjectId,
    index: true
  },
  galleryId: {
    type: Types.ObjectId,
    index: true
  },
  // original file
  fileId: Types.ObjectId,
  title: {
    type: String
    // TODO - text index?
  },
  description: String,
  status: {
    type: String,
    // draft, active, pending, file-error
    default: 'active'
  },
  price: {
    type: Number,
    default: 0
  },
  processing: Boolean,
  isGalleryCover: {
    type: Boolean,
    default: false
  },
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
