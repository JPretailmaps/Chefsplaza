import { Document, Types } from 'mongoose';

export class PaymentGatewaySettingModel extends Document {
  performerId: Types.ObjectId;

  // active, etc...
  status: string;

  // eg ccbill, paypal
  key: string;

  value: any;
}
