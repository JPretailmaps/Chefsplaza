import { Schema } from 'mongoose';

export const PaymentCardSchema = new Schema({
  // user...
  source: {
    type: String
  },
  sourceId: {
    type: Schema.Types.ObjectId
  },
  paymentGateway: {
    type: String,
    default: 'stripe'
  },
  isProduction: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: String
  },
  holderName: String,
  last4Digits: String,
  brand: String,
  month: String,
  year: String,
  // card id, card token,...
  token: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'paymentcards'
});
