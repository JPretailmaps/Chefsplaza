import { Document, Types } from 'mongoose';

export class CommissionSettingModel extends Document {
  performerId: Types.ObjectId;

  monthlySubscriptionCommission: number;

  yearlySubscriptionCommission: number;

  videoSaleCommission: number;

  gallerySaleCommission: number;

  productSaleCommission: number;

  feedSaleCommission: number;

  tipCommission: number;

  streamCommission: number;

  messageSaleCommission: number;

  createdAt: Date;

  updatedAt: Date;
}
