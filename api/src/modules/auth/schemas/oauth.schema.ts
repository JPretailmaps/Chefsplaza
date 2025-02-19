import * as mongoose from 'mongoose';

export const OAuthLoginSchema = new mongoose.Schema({
  source: {
    type: String,
    default: 'user'
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  provider: {
    type: String
  },
  value: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'oauthloginsocials'
});
