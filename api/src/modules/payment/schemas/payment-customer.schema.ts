import { Schema } from 'mongoose';

export const PaymentCustomerSchema = new Schema({
  // user, model, etc...
  source: {
    type: String,
    index: true
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
  customerId: String,
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  collection: 'paymentcustomers'
});
