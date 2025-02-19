import { Document, Types } from 'mongoose';

export class EarningModel extends Document {
  transactionId: Types.ObjectId;

  performerId: Types.ObjectId;

  userId: Types.ObjectId;

  sourceType: string;

  type: string;

  grossPrice: number;

  netPrice: number;

  siteCommission: number;

  isPaid: boolean;

  createdAt: Date;

  paidAt: Date;

  paymentGateway: string;

  isToken: boolean;
}
