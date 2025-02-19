import { Document, Types } from 'mongoose';

export class SubscriptionPlanModel extends Document {
  performerId: Types.ObjectId;

  paymentGateway: string;

  subscriptionType: string;

  price: number;

  planId: string;

  metaData: any;

  createdAt: Date;

  updatedAt: Date;
}
