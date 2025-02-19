import { Types } from 'mongoose';
import { pick } from 'lodash';

export class ProductDto {
  _id: Types.ObjectId;

  performerId: Types.ObjectId;

  digitalFileId: Types.ObjectId;

  digitalFileUrl: string;

  imageId: Types.ObjectId;

  image: string;

  type: string;

  name: string;

  slug: string;

  description: string;

  status: string;

  price: number;

  stock: number;

  performer: any;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  isBookMarked: boolean;

  stats: {
    likes: number;
    bookmarks: number;
    comments: number;
    views: number;
  };

  constructor(init: Partial<ProductDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'performerId',
        'digitalFileId',
        'digitalFileUrl',
        'imageId',
        'image',
        'type',
        'name',
        'slug',
        'description',
        'status',
        'price',
        'stock',
        'performer',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedAt',
        'isBookMarked',
        'stats'
      ])
    );
  }

  toPublic() {
    return {
      _id: this._id,
      performerId: this.performerId,
      digitalFileId: this.digitalFileId,
      image: this.image,
      type: this.type,
      name: this.name,
      slug: this.slug,
      description: this.description,
      status: this.status,
      price: this.price,
      stock: this.stock,
      performer: this.performer,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isBookMarked: this.isBookMarked,
      stats: this.stats
    };
  }
}
