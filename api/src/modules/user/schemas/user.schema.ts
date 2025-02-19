import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { STATUS_ACTIVE, ROLE_USER } from '../constants';

export const userSchema = new mongoose.Schema({
  name: { type: String, index: true },
  firstName: String,
  lastName: String,
  username: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    // uniq if not null
    sparse: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    // uniq if not null
    sparse: true
  },
  verifiedEmail: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String
  },
  roles: [
    {
      type: String,
      default: ROLE_USER
    }
  ],
  avatarId: Types.ObjectId,
  avatarPath: String,
  status: {
    type: String,
    default: STATUS_ACTIVE
  },
  gender: {
    type: String,
    index: true
  },
  balance: {
    type: Number,
    default: 0
  },
  country: {
    type: String
  },
  isOnline: {
    type: Number,
    default: 0
  },
  onlineAt: {
    type: Date
  },
  offlineAt: {
    type: Date
  },
  stats: {
    totalSubscriptions: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  googleConnected: {
    type: Boolean,
    default: false
  },
  twitterConnected: {
    type: Boolean,
    default: false
  }
});

export const UserSchema = userSchema;
