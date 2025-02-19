import { Document, Types } from 'mongoose';

export class OrderModel extends Document {
  transactionId: Types.ObjectId;

  performerId: Types.ObjectId;

  userId: Types.ObjectId;

  orderNumber: string;

  shippingCode: string;

  productId: Types.ObjectId;

  productInfo: any;

  quantity: number;

  unitPrice: number;

  totalPrice: number;

  deliveryAddressId: Types.ObjectId;

  deliveryAddress: string;

  deliveryStatus: string;

  userNote: string;

  phoneNumber: string;

  createdAt: Date;

  updatedAt: Date;
}
