import { Schema, Types } from 'mongoose';

export const ProductSchema = new Schema({
  performerId: {
    type: Types.ObjectId,
    index: true
  },
  // original file
  digitalFileId: Types.ObjectId,
  imageId: Types.ObjectId,
  name: {
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
  type: {
    type: String,
    default: 'physical'
  },
  status: {
    type: String,
    default: 'active'
  },
  price: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
