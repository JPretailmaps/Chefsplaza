import { Document, Types } from 'mongoose';

export class BannerModel extends Document {
  fileId: Types.ObjectId;

  title: string;

  description: string;

  link: string;

  status: string;

  position: string;

  processing: boolean;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
