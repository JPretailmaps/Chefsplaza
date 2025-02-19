import { Types } from 'mongoose';
import { pick } from 'lodash';

export class OrderDto {
  _id: Types.ObjectId;

  transactionId: Types.ObjectId;

  performerId: Types.ObjectId;

  performerInfo?: any;

  userId: Types.ObjectId;

  userInfo?: any;

  orderNumber: string;

  shippingCode: string;

  productId: Types.ObjectId;

  productInfo: any;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  deliveryAddress?: string;

  deliveryStatus: string;

  deliveryAddressId?: Types.ObjectId;

  userNote?: string;

  phoneNumber?: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(data?: Partial<OrderDto>) {
    data
      && Object.assign(
        this,
        pick(data, [
          '_id',
          'transactionId',
          'performerId',
          'performerInfo',
          'userId',
          'userInfo',
          'orderNumber',
          'shippingCode',
          'productId',
          'productInfo',
          'quantity',
          'unitPrice',
          'totalPrice',
          'deliveryAddress',
          'deliveryStatus',
          'deliveryAddressId',
          'userNote',
          'phoneNumber',
          'createdAt',
          'updatedAt'
        ])
      );
  }
}
