import { Document, Types } from 'mongoose';

export class PaymentCustomerModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  paymentGateway: string;

  isProduction: boolean;

  customerId: string;

  name: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;
}
