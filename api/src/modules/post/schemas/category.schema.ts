import { Schema, Types } from 'mongoose';

export const CategorySchema = new Schema({
  type: {
    type: String,
    index: true
  },
  parentId: {
    type: Types.ObjectId,
    index: true
  },
  title: String,
  slug: {
    type: String,
    index: true
  },
  description: String,
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
