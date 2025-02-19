import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  source: {
    type: String,
    default: 'user'
  },
  sourceId: {
    type: mongoose.Types.ObjectId,
    index: true
  },
  type: {
    type: String,
    default: 'password'
  },
  key: {
    type: String,
    index: true
  },
  value: String,
  salt: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'auth'
});
