import * as mongoose from 'mongoose';

export const EarningSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  performerId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  // group of item and rename
  sourceType: {
    type: String,
    index: true
  },
  // from details of item
  type: {
    type: String,
    index: true
  },
  grossPrice: {
    type: Number,
    default: 0
  },
  netPrice: {
    type: Number,
    default: 0
  },
  siteCommission: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false,
    index: true
  },
  paymentGateway: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  isToken: {
    type: Boolean,
    default: true
  }
});

EarningSchema.index({
  performerId: 1,
  type: 1,
  isToken: 1
});

EarningSchema.index({
  performerId: 1,
  type: 1,
  isToken: 1,
  createdAt: -1
});
