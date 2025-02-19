import { Types } from 'mongoose';
import { pick } from 'lodash';

export class EarningDto {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userInfo?: any;

  transactionId: Types.ObjectId;

  transactionInfo?: any;

  performerId: Types.ObjectId;

  performerInfo?: any;

  sourceType: string;

  type: string;

  grossPrice: number;

  netPrice: number;

  siteCommission: number;

  isPaid?: boolean;

  createdAt: Date;

  paidAt: Date;

  paymentGateway?: string;

  isToken?: boolean;

  constructor(data?: Partial<EarningDto>) {
    Object.assign(
      this,
      pick(data, [
        '_id',
        'userId',
        'userInfo',
        'transactionId',
        'transactionInfo',
        'performerId',
        'performerInfo',
        'sourceType',
        'type',
        'grossPrice',
        'netPrice',
        'isPaid',
        'siteCommission',
        'createdAt',
        'paidAt',
        'paymentGateway',
        'isToken'
      ])
    );
  }
}

export interface IEarningStatResponse {
  totalGrossPrice: number;
  totalNetPrice: number;
  totalSiteCommission: number;
}
