import { Document, Types } from 'mongoose';

export class PostModel extends Document {
  authorId: Types.ObjectId;

  type = 'post';

  title: string;

  slug: string;

  ordering: number;

  content: string;

  shortDescription: string;

  categoryIds: string[] = [];

  // store all related categories such as parent ids int search filter
  categorySearchIds?: string[] = [];

  status = 'draft';

  image?: string;

  updatedBy?: Types.ObjectId;

  createdBy?: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
