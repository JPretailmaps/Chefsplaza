import { Document, Types } from 'mongoose';

export class GalleryModel extends Document {
  performerId: Types.ObjectId;

  type: string;

  title: string;

  slug: string;

  description: string;

  status: string;

  coverPhotoId: Types.ObjectId;

  price: number;

  isSale: boolean;

  numOfItems: number;

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
