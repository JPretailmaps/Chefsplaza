import { IPerformer } from './performer';
import { ISearch } from './utils';

export interface IFeed {
    _id: string;
    type: string;
    fromSourceId: string;
    performer: IPerformer;
    fromSource: string;
    title: string;
    text: string;
    fileIds: Array<string>;
    totalLike: number;
    totalComment: number;
    createdAt: Date;
    updatedAt: Date;
    files: any;
    isLiked: boolean;
    isSale: boolean;
    price: number;
    isSubscribed: boolean;
    isBought: boolean;
    polls: any[];
    pollIds: string[];
    pollExpiredAt: Date;
    isBookMarked: boolean;
    thumbnail: {
        _id: string;
        url: string;
        thumbnails: string[]
    };
    teaser: {
        _id: string;
        url: string;
        name: string;
        percent: number;
        size: number;
        thumbnails: string[]
    };
    isSchedule: boolean;
    scheduleAt: Date;
    status: string;
    teaserId: string;
    thumbnailId: string;
    streamingScheduled: Date;
}

export interface IFeedSearch extends ISearch {
    q: string;
    sort: string;
    sortBy: string;
}
