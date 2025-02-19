import { Types } from 'mongoose';
import { pick } from 'lodash';

export class VideoDto {
  _id: Types.ObjectId;

  performerId: Types.ObjectId;

  fileId: Types.ObjectId;

  type: string;

  title: string;

  slug: string;

  description: string;

  status: string;

  tags: string[];

  processing: boolean;

  thumbnailId: Types.ObjectId;

  thumbnail: any;

  isSale: boolean;

  price: number;

  teaserId: Types.ObjectId;

  teaser: any;

  teaserProcessing: boolean;

  video: any;

  performer: any;

  stats: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  participantIds: string[];

  participants: any[];

  isSubscribed: boolean;

  isBought: boolean;

  isLiked: boolean;

  isBookmarked: boolean;

  constructor(init: Partial<VideoDto>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'performerId',
        'fileId',
        'type',
        'title',
        'slug',
        'description',
        'status',
        'processing',
        'thumbnailId',
        'teaserId',
        'teaser',
        'teaserProcessing',
        'isSchedule',
        'isSale',
        'price',
        'video',
        'thumbnail',
        'performer',
        'tags',
        'stats',
        'createdBy',
        'updatedBy',
        'scheduledAt',
        'createdAt',
        'updatedAt',
        'participantIds',
        'participants',
        'isBought',
        'isSubscribed',
        'isLiked',
        'isBookmarked'
      ])
    );
  }
}

export class IVideoResponse {
  _id: Types.ObjectId;

  performerId: Types.ObjectId;

  fileId: Types.ObjectId;

  type: string;

  title: string;

  slug: string;

  description: string;

  status: string;

  tags: string[];

  processing: boolean;

  thumbnailId: Types.ObjectId;

  thumbnail: any;

  teaserId: Types.ObjectId;

  teaser: any;

  teaserProcessing: boolean;

  isSale: boolean;

  price: number;

  video: any;

  performer: any;

  stats: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };

  isLiked: boolean;

  isBookmarked: boolean;

  isBought: boolean;

  isSubscribed: boolean;

  createdBy: Types.ObjectId;

  updatedBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  participantIds: string[];

  participants: any[];

  constructor(init: Partial<IVideoResponse>) {
    Object.assign(
      this,
      pick(init, [
        '_id',
        'performerId',
        'fileId',
        'type',
        'title',
        'description',
        'status',
        'processing',
        'thumbnailId',
        'teaserId',
        'teaser',
        'teaserProcessing',
        'isSchedule',
        'isSale',
        'price',
        'video',
        'thumbnail',
        'performer',
        'tags',
        'stats',
        'isBought',
        'isSubscribed',
        'isLiked',
        'isBookmarked',
        'createdBy',
        'updatedBy',
        'scheduledAt',
        'createdAt',
        'updatedAt',
        'participantIds',
        'participants'
      ])
    );
  }
}
