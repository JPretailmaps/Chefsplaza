import { Document, Types } from 'mongoose';

export class FollowModel extends Document {
  followerId: Types.ObjectId;

  followingId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
