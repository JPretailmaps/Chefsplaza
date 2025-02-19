import { Document, Types } from 'mongoose';

export class PerformerModel extends Document {
  _id: Types.ObjectId;

  name: string;

  firstName: string;

  lastName: string;

  username: string;

  email: string;

  phone: string;

  phoneCode: string; // international code prefix

  avatarId: Types.ObjectId;

  avatarPath: string;

  coverId: Types.ObjectId;

  coverPath: string;

  idVerificationId: Types.ObjectId;

  documentVerificationId: Types.ObjectId;

  verifiedEmail: boolean;

  verifiedAccount: boolean;

  verifiedDocument: boolean;

  status: string;

  gender: string;

  country: string;

  city: string;

  state: string;

  zipcode: string;

  address: string;

  languages: string[];

  height: string;

  weight: string;

  hair: string;

  butt: string;

  ethnicity: string;

  bio: string;

  eyes: string;

  sexualOrientation: string;

  dateOfBirth: Date;

  bodyType: string;

  isFreeSubscription: boolean;

  durationFreeSubscriptionDays: number;

  monthlyPrice: number;

  yearlyPrice: number;

  stats: {
    likes: number;
    subscribers: number;
    views: number;
    totalVideos: number;
    totalPhotos: number;
    totalGalleries: number;
    totalProducts: number;
    totalFeeds: number;
    totalStreamTime: number;
    followers: number;
  };

  // score custom from other info like likes, subscribes, views....
  score: number;

  createdAt: Date;

  updatedAt: Date;

  isOnline: boolean;

  onlineAt: Date;

  offlineAt: Date;

  welcomeVideoId: Types.ObjectId;

  welcomeVideoPath: string;

  activateWelcomeVideo: boolean;

  lastStreamingTime: Date;

  live: number;

  streamingStatus: string;

  twitterConnected: boolean;

  googleConnected: boolean;

  publicChatPrice: number;

  balance: number;

  commissionPercentage: number;

  isFeatured: boolean;

  categoryIds: Types.ObjectId[];
}
