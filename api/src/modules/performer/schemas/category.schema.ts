import { Schema, Types } from 'mongoose';

export const CategorySchema = new Schema({
  name: String,
  slug: {
    type: String,
    index: true
  },
  ordering: { type: Number, default: 0 },
  description: String,
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
