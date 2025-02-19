import { Schema, Types } from 'mongoose';

export const PostMetaSchema = new Schema({
  postId: {
    type: Types.ObjectId,
    index: true,
    required: true
  },
  key: {
    type: String,
    index: true
  },
  value: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
