import { Document, Types } from 'mongoose';

export class VideoModel extends Document {
  performerId: Types.ObjectId;

  fileId: Types.ObjectId;

  type: string;

  title: string;

  slug: string;

  description: string;

  status: string;

  processing: boolean;

  thumbnailId: Types.ObjectId;

  teaserId: Types.ObjectId;

  teaserProcessing: boolean;

  isSale: boolean;

  isSchedule: boolean;

  price: number;

  tags: string[];

  stats: {
    likes: number,
    bookmarks: number,
    views: number,
    comments: number
  };

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  scheduledAt: Date;

  createdAt: Date;

  updatedAt: Date;

  participantIds?: string[];
}
