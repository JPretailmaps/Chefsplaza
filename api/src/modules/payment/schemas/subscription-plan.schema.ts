import { Schema } from 'mongoose';

export const SubscriptionPlanSchema = new Schema({
  performerId: {
    type: Schema.Types.ObjectId
  },
  paymentGateway: {
    type: String,
    default: 'stripe'
  },
  subscriptionType: {
    type: String,
    enum: ['free_subscription', 'monthly_subscription', 'yearly_subscription']
  },
  price: {
    type: Number,
    default: 0
  },
  planId: {
    type: String
  },
  metaData: {
    type: Schema.Types.Mixed
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SubscriptionPlanSchema.index({
  performerId: 1,
  subscriptionType: 1,
  price: 1
});
