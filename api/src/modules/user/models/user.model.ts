import { Document, Types } from 'mongoose';

export class UserModel extends Document {
  name: string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  roles: string[];

  avatarId: Types.ObjectId;

  avatarPath: string;

  status: string;

  balance: number;

  username: string;

  country: string;

  gender: string;

  isOnline: boolean;

  onlineAt: Date;

  offlineDat: Date;

  createdAt: Date;

  updatedAt: Date;

  verifiedEmail: boolean;

  twitterProfile: any;

  twitterConnected: boolean;

  googleProfile: any;

  googleConnected: boolean;

  stats: {
    totalSubscriptions: number;
    following: number;
  };
}
