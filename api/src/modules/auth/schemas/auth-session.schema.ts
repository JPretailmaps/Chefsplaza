import * as mongoose from 'mongoose';

export const AuthSessionSchema = new mongoose.Schema({
  source: {
    type: String,
    default: 'user'
  },
  sourceId: {
    type: mongoose.Types.ObjectId,
    index: true,
    unique: true
  },
  token: {
    type: String,
    index: true
  },
  expiryAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'auth_sessions'
});
