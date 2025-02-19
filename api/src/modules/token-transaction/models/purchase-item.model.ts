import { Document, Types } from 'mongoose';

export class PaymentProductModel {
  name: string;

  description: string;

  price: number;

  extraInfo?: any;

  productType: string;

  productId: Types.ObjectId;

  performerId: Types.ObjectId;

  quantity: number;

  tokens?: number;
}

export class TokenTransactionModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  target: string;

  targetId: Types.ObjectId;

  sessionId: string;

  performerId: Types.ObjectId;

  type: string;

  totalPrice: number;

  originalPrice: number;

  products: PaymentProductModel[];

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
