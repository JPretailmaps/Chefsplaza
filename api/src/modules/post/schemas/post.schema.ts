import { Schema, Types } from 'mongoose';

export const PostSchema = new Schema({
  authorId: Types.ObjectId,
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
    unique: true
  },
  ordering: { type: Number, default: 0 },
  content: String,
  shortDescription: String,
  categoryIds: [
    {
      type: Types.ObjectId,
      default: []
    }
  ],
  // store all related categories such as parent ids int search filter
  categorySearchIds: [
    {
      type: Types.ObjectId,
      default: []
    }
  ],
  status: {
    type: String,
    default: 'draft'
  },
  image: {
    type: Schema.Types.Mixed
  },
  createdBy: Types.ObjectId,
  updatedBy: Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
