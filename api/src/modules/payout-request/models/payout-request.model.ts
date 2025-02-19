import { Document, Types } from 'mongoose';

export class PayoutRequestModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  paymentAccountType?: string;

  requestNote?: string;

  adminNote?: string;

  status?: string;

  requestTokens?: number;

  tokenConversionRate?: number;

  payoutId?: string;

  createdAt: Date;

  updatedAt: Date;
}
