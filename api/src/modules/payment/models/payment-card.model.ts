import { Document, Types } from 'mongoose';

export class PaymentCardModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  paymentGateway: string;

  isProduction: boolean;

  customerId: string;

  holderName: string;

  last4Digits: string;

  brand: string;

  month: string;

  year: string;

  // card id, card token,...
  token: string;

  createdAt: Date;

  updatedAt: Date;
}
