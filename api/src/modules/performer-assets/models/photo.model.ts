import { Document, Types } from 'mongoose';

export class PhotoModel extends Document {
  performerId: Types.ObjectId;

  galleryId: Types.ObjectId;

  fileId: Types.ObjectId;

  type: string;

  title: string;

  description: string;

  status: string;

  processing: boolean;

  isGalleryCover: boolean;

  price: number;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
