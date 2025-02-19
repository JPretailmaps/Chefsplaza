import * as mongoose from 'mongoose';
import {
  GROUP_CHAT, OFFLINE, PRIVATE_CHAT, PUBLIC_CHAT
} from 'src/modules/stream/constant';

const performerSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
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
  status: {
    type: String,
    index: true
  },
  firstName: String,
  lastName: String,
  dateOfBirth: {
    type: Date
  },
  bodyType: {
    type: String
  },
  phone: {
    type: String
  },
  phoneCode: String, // international code prefix
  avatarId: {
    type: mongoose.Schema.Types.ObjectId
  },
  avatarPath: String,
  coverId: {
    type: mongoose.Schema.Types.ObjectId
  },
  coverPath: String,
  idVerificationId: {
    type: mongoose.Schema.Types.ObjectId
  },
  documentVerificationId: {
    type: mongoose.Schema.Types.ObjectId
  },
  welcomeVideoId: {
    type: mongoose.Schema.Types.ObjectId
  },
  welcomeVideoPath: {
    type: String
  },
  activateWelcomeVideo: {
    type: Boolean,
    default: false
  },
  verifiedEmail: {
    type: Boolean,
    default: false
  },
  verifiedAccount: {
    type: Boolean,
    default: false
  },
  verifiedDocument: {
    type: Boolean,
    default: false,
    index: true
  },
  gender: {
    type: String
  },
  country: {
    type: String
  },
  city: String,
  state: String,
  zipcode: String,
  address: String,
  languages: [
    {
      type: String,
      _id: false
    }
  ],
  categoryIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      _id: false,
      index: true
    }
  ],
  height: {
    type: String
  },
  weight: {
    type: String
  },
  bio: String,
  eyes: {
    type: String
  },
  hair: {
    type: String
  },
  butt: {
    type: String
  },
  ethnicity: {
    type: String
  },
  sexualOrientation: {
    type: String
  },
  isFreeSubscription: {
    type: Boolean,
    default: true,
    index: true
  },
  durationFreeSubscriptionDays: {
    type: Number,
    default: 1
  },
  monthlyPrice: {
    type: Number,
    default: 2.95
  },
  yearlyPrice: {
    type: Number,
    default: 2.95
  },
  publicChatPrice: {
    type: Number,
    default: 1
  },
  stats: {
    likes: {
      type: Number,
      default: 0
    },
    subscribers: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    totalVideos: {
      type: Number,
      default: 0
    },
    totalPhotos: {
      type: Number,
      default: 0
    },
    totalGalleries: {
      type: Number,
      default: 0
    },
    totalProducts: {
      type: Number,
      default: 0
    },
    totalFeeds: {
      type: Number,
      default: 0
    },
    totalStreamTime: {
      type: Number,
      default: 0
    }
  },
  score: {
    type: Number,
    default: 0
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastStreamingTime: Date,
  live: {
    type: Number,
    default: 0
  },
  streamingStatus: {
    type: String,
    enum: [PUBLIC_CHAT, PRIVATE_CHAT, GROUP_CHAT, OFFLINE],
    default: OFFLINE
  },
  twitterConnected: {
    type: Boolean,
    default: false
  },
  googleConnected: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  commissionPercentage: {
    type: Number,
    default: 0.1
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  }
});

performerSchema.pre<any>('updateOne', async function preUpdateOne(next) {
  const model = await this.model.findOne(this.getQuery());
  if (!model) return next();
  const { stats } = model;
  if (!stats) {
    return next();
  }
  const score = (stats.subscribers || 0) * 3 + (stats.likes || 0) * 2 + (stats.views || 0);
  model.score = score || 0;
  await model.save();
  return next();
});

export const PerformerSchema = performerSchema;
