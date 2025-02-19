import { Types } from 'mongoose';
import { pick } from 'lodash';

export class PhotoDto {
  _id?: Types.ObjectId;

  performerId?: Types.ObjectId;

  galleryId?: Types.ObjectId;

  fileId?: Types.ObjectId;

  photo?: any;

  type?: string;

  title?: string;

  description?: string;

  status?: string;

  processing?: boolean;

  price?: number;

  performer?: any;

  gallery?: any;

  isGalleryCover?: boolean;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;

  constructor(init?: Partial<PhotoDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'performerId',
        'galleryId',
        'fileId',
        'photo',
        'type',
        'title',
        'description',
        'status',
        'processing',
        'price',
        'isGalleryCover',
        'performer',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt'
      ])
    );
  }
}
