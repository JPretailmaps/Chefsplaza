import { Document, Types } from 'mongoose';

export class ProductModel extends Document {
  performerId: Types.ObjectId;

  digitalFileId: Types.ObjectId;

  imageId: Types.ObjectId;

  type: string;

  name: string;

  slug: string;

  description: string;

  status: string;

  price: number;

  stock: number;

  stats: {
    likes: number;
    bookmarks: number;
    comments: number;
    views: number;
  };

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
