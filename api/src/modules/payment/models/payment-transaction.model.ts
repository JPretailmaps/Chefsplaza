import { Document, Types } from 'mongoose';

export class PaymentProductModel {
  name: string;

  description: string;

  price: number;

  extraInfo: any;

  productType: string;

  productId: Types.ObjectId;

  performerId: Types.ObjectId;

  quantity: number;

  tokens: number;
}

export class PaymentTransactionModel extends Document {
  paymentGateway: string;

  source: string;

  sourceId: Types.ObjectId;

  target: string;

  targetId: Types.ObjectId;

  performerId: Types.ObjectId;

  couponInfo: any;

  // subscription, store, etc...
  type: string;

  totalPrice: number;

  originalPrice: number;

  products: PaymentProductModel[];

  paymentResponseInfo: any;

  invoiceId: string;

  stripeClientSecret: string;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
