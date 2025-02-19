import { Types } from 'mongoose';
import { pick } from 'lodash';
import { ICouponResponse } from 'src/modules/coupon/dtos';

export interface PaymentProduct {
  name?: string;
  description?: string;
  price?: number;
  extraInfo?: any;
  productType?: string;
  productId?: Types.ObjectId;
  performerId?: Types.ObjectId;
  quantity?: number;
}

export class IPaymentResponse {
  _id: Types.ObjectId;

  paymentGateway?: string;

  sourceInfo?: any;

  source?: string;

  sourceId: Types.ObjectId;

  performerId?: Types.ObjectId;

  performerInfo?: any;

  target?: string;

  targetId?: Types.ObjectId;

  type?: string;

  products?: PaymentProduct[];

  paymentResponseInfo?: any;

  invoiceId?: string;

  stripeClientSecret?: string;

  totalPrice?: number;

  originalPrice?: number;

  couponInfo?: ICouponResponse;

  status?: string;

  createdAt: Date;

  updatedAt: Date;
}

export class PaymentDto {
  _id: Types.ObjectId;

  paymentGateway?: string;

  sourceInfo?: any;

  source?: string;

  sourceId: Types.ObjectId;

  performerId?: Types.ObjectId;

  performerInfo?: any;

  target?: string;

  targetId?: Types.ObjectId;

  type?: string;

  products?: PaymentProduct[];

  paymentResponseInfo?: any;

  invoiceId?: string;

  stripeClientSecret?: string;

  totalPrice?: number;

  originalPrice?: number;

  couponInfo?: ICouponResponse;

  status?: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(data?: Partial<PaymentDto>) {
    data
      && Object.assign(
        this,
        pick(data, [
          '_id',
          'paymentGateway',
          'sourceInfo',
          'source',
          'sourceId',
          'performerId',
          'performerInfo',
          'target',
          'targetId',
          'type',
          'products',
          'paymentResponseInfo',
          'invoiceId',
          'stripeClientSecret',
          'status',
          'totalPrice',
          'originalPrice',
          'couponInfo',
          'createdAt',
          'updatedAt'
        ])
      );
  }

  toResponse(includePrivateInfo = false): IPaymentResponse {
    const publicInfo = {
      _id: this._id,
      paymentGateway: this.paymentGateway,
      sourceId: this.sourceId,
      source: this.source,
      sourceInfo: this.sourceInfo,
      performerId: this.performerId,
      performerInfo: this.performerInfo,
      target: this.target,
      targetId: this.targetId,
      type: this.type,
      products: this.products,
      totalPrice: this.totalPrice,
      originalPrice: this.originalPrice,
      couponInfo: this.couponInfo,
      status: this.status,
      stripeClientSecret: this.stripeClientSecret,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    const privateInfo = {
      paymentResponseInfo: this.paymentResponseInfo,
      invoiceId: this.invoiceId
    };
    if (!includePrivateInfo) {
      return publicInfo;
    }

    return {
      ...publicInfo,
      ...privateInfo
    };
  }
}
