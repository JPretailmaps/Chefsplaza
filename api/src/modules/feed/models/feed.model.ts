import { Document, Types } from 'mongoose';

export class FeedModel extends Document {
  _id: Types.ObjectId;

  type: string;

  fromSourceId: Types.ObjectId;

  fromSource: string;

  title: string;

  slug: string;

  text: string;

  pollDescription: string;

  fileIds: Array<Types.ObjectId>;

  pollIds: Array<Types.ObjectId>;

  totalLike: number;

  totalComment: number;

  isSale: boolean;

  price: number;

  teaserId: Types.ObjectId;

  thumbnailId: Types.ObjectId;

  isPinned: boolean;

  status: string;

  isSchedule: boolean;

  scheduleAt: Date;

  streamingScheduled: Date;

  pinnedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
