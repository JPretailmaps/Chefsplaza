import {
  Injectable, Inject, forwardRef, HttpException
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  EntityNotFoundException,
  QueueEventService, QueueEvent, ForbiddenException
} from 'src/kernel';
import { flattenDeep, uniq } from 'lodash';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { ReactionService } from 'src/modules/reaction/services/reaction.service';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { EVENT, STATUS } from 'src/kernel/constants';
import { REACTION, REACTION_TYPE } from 'src/modules/reaction/constants';
import { PurchaseItemType, PURCHASE_ITEM_STATUS, PURCHASE_ITEM_TARTGET_TYPE } from 'src/modules/token-transaction/constants';
import { REF_TYPE } from 'src/modules/file/constants';
import { TokenTransactionSearchService, TokenTransactionService } from 'src/modules/token-transaction/services';
import { UserDto } from 'src/modules/user/dtos';
import { isObjectId, toObjectId } from 'src/kernel/helpers/string.helper';
import * as moment from 'moment';
import { Storage } from 'src/modules/storage/contants';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { BlockService } from 'src/modules/block/services';
import { FeedDto, PollDto } from '../dtos';
import { InvalidFeedTypeException, AlreadyVotedException, PollExpiredException } from '../exceptions';
import {
  FEED_TYPES, POLL_TARGET_SOURCE,
  PERFORMER_FEED_CHANNEL, VOTE_FEED_CHANNEL, FEED_TYPE
} from '../constants';
import { FeedCreatePayload, FeedSearchRequest, PollCreatePayload } from '../payloads';
import {
  FeedModel, PollModel, VoteModel, ScheduledStreamNotificationModel
} from '../models';
import {
  FEED_PROVIDER, POLL_PROVIDER, VOTE_PROVIDER, SCHEDULED_STREAM_NOTIFICATION_PROVIDER
} from '../providers';

@Injectable()
export class FeedService {
  constructor(
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => TokenTransactionSearchService))
    private readonly tokenTransactionSearchService: TokenTransactionSearchService,
    @Inject(forwardRef(() => TokenTransactionService))
    private readonly paymentTokenService: TokenTransactionService,
    @Inject(forwardRef(() => ReactionService))
    private readonly reactionService: ReactionService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(POLL_PROVIDER)
    private readonly PollVoteModel: Model<PollModel>,
    @Inject(VOTE_PROVIDER)
    private readonly voteModel: Model<VoteModel>,
    @Inject(SCHEDULED_STREAM_NOTIFICATION_PROVIDER)
    private readonly scheduledStreamNotificationModel: Model<ScheduledStreamNotificationModel>,
    @Inject(FEED_PROVIDER)
    private readonly feedModel: Model<FeedModel>,
    private readonly queueEventService: QueueEventService,
    private readonly blockService: BlockService
  ) {
  }

  public async find(query) {
    return this.feedModel.find(query);
  }

  public async findById(id) {
    const data = await this.feedModel.findById(id);
    return data;
  }

  public async findByIds(ids: string[] | Types.ObjectId[]) {
    const data = await this.feedModel.find({ _id: { $in: ids } });
    return data;
  }

  public async handleCommentStat(feedId: string | Types.ObjectId, num = 1) {
    await this.feedModel.updateOne({ _id: feedId }, { $inc: { totalComment: num } });
  }

  private async _validatePayload(payload: FeedCreatePayload) {
    if (!FEED_TYPES.includes(payload.type)) {
      throw new InvalidFeedTypeException();
    }
  }

  public async populateFeedData(feeds: any, user: UserDto, jwToken?: string) {
    const performerIds = uniq(
      feeds.map((f) => f.fromSourceId.toString())
    );
    const feedIds = feeds.map((f) => f._id);
    const pollIds = flattenDeep([feeds.map((f) => [f.pollIds])]);
    const fileIds = flattenDeep([feeds.map((f) => [f.fileIds])]);

    feeds.forEach((f) => {
      if (f.thumbnailId) fileIds.push(f.thumbnailId);
      if (f.teaserId) fileIds.push(f.teaserId);
    });
    const [performers, files, actions, subscriptions, transactions, polls, follows] = await Promise.all([
      performerIds.length ? this.performerService.findByIds(performerIds) : [],
      fileIds.length ? this.fileService.findByIds(fileIds) : [],
      user && user._id ? this.reactionService.findByQuery({
        objectType: REACTION_TYPE.FEED,
        objectId: { $in: feedIds },
        createdBy: user._id
      }) : [],
      user && user._id ? this.subscriptionService.findSubscriptionList({
        userId: user._id,
        performerId: { $in: performerIds }
      }) : [],
      user && user._id ? this.tokenTransactionSearchService.findByQuery({
        sourceId: user._id,
        targetId: { $in: feedIds },
        target: PURCHASE_ITEM_TARTGET_TYPE.FEED,
        status: PURCHASE_ITEM_STATUS.SUCCESS
      }) : [],
      pollIds.length ? this.PollVoteModel.find({ _id: { $in: pollIds } }) : [],
      user && user._id ? this.followService.find({
        followerId: user._id,
        followingId: { $in: performerIds }
      }) : []
    ]);

    return feeds.map((f) => {
      const feed = new FeedDto(f);
      const like = actions.find((l) => l.objectId.toString() === f._id.toString() && l.action === REACTION.LIKE);
      feed.isLiked = !!like;
      const bookmarked = actions.find((l) => l.objectId.toString() === f._id.toString() && l.action === REACTION.BOOKMARK);
      feed.isBookMarked = !!bookmarked;
      const subscription = subscriptions.find((s) => `${s.performerId}` === `${f.fromSourceId}`);
      feed.isSubscribed = subscription && moment().isBefore(subscription.expiredAt);
      feed.isBought = !!transactions.find((transaction) => `${transaction.targetId}` === `${f._id}`);
      feed.isFollowed = !!follows.find((fol) => `${fol.followingId}` === `${f.fromSourceId}`);
      if (feed.isSale && !feed.price) {
        feed.isBought = true;
      }
      const feedFileStringIds = (f.fileIds || []).map((fileId) => fileId.toString());
      const feedPollStringIds = (f.pollIds || []).map((pollId) => pollId.toString());
      feed.polls = polls.filter((p) => feedPollStringIds.includes(p._id.toString()));
      const feedFiles = files.filter((file) => feedFileStringIds.includes(file._id.toString()));
      if ((user && user._id && `${user._id}` === `${f.fromSourceId}`)
        || (user && user.roles && user.roles.includes('admin'))) {
        feed.isSubscribed = true;
        feed.isBought = true;
      }
      let canView = (feed.isSale && feed.isBought) || (!feed.isSale && feed.isSubscribed) || (feed.isSale && !feed.price);
      if (feed.isSchedule && moment(feed.scheduleAt).isBefore(new Date())) {
        canView = false;
      }

      if (feedFiles.length) {
        feed.files = feedFiles.map((file) => {
          // track server s3 or local, assign jwtoken if local
          let fileUrl = file.getUrl(canView);
          if (file.server !== Storage.S3) {
            fileUrl = `${fileUrl}?feedId=${feed._id}&token=${jwToken}`;
          }
          return {
            ...file.toResponse(),
            thumbnails: file.getThumbnails(),
            url: fileUrl
          };
        });
      }
      if (feed.thumbnailId) {
        const thumbnail = files.find((file) => file._id.toString() === feed.thumbnailId.toString());
        feed.thumbnail = thumbnail && {
          ...thumbnail.toResponse(),
          thumbnails: thumbnail.getThumbnails(),
          url: thumbnail.getUrl()
        };
      }
      if (feed.teaserId) {
        const teaser = files.find((file) => file._id.toString() === feed.teaserId.toString());
        feed.teaser = teaser && {
          ...teaser,
          thumbnails: teaser.getThumbnails(),
          url: teaser.getUrl()
        };
      }
      const performer = performers.find((p) => p._id.toString() === f.fromSourceId.toString());
      if (performer) {
        feed.performer = performer.toPublicDetailsResponse();
        if (subscription && subscription.usedFreeSubscription) {
          feed.performer.isFreeSubscription = false;
        }
      }
      return feed;
    });
  }

  public async findOne(id: string, user: UserDto, jwToken: string): Promise<FeedDto> {
    const query = isObjectId(id) ? { _id: id } : { slug: id };
    const feed = await this.feedModel.findOne(query);
    if (!feed) {
      throw new EntityNotFoundException();
    }
    const newFeed = await this.populateFeedData([feed], user, jwToken);
    return new FeedDto(newFeed[0]);
  }

  public async create(payload: FeedCreatePayload, user: UserDto): Promise<any> {
    await this._validatePayload(payload);
    const fromSourceId = user.roles && user.roles.includes('admin') && payload.fromSourceId ? payload.fromSourceId : user._id;
    const performer = await this.performerService.findById(fromSourceId);
    if (!performer) throw new EntityNotFoundException();
    const data = { ...payload } as any;
    data.slug = `post-${new Date().getTime()}`;
    const slugCheck = await this.feedModel.countDocuments({
      slug: data.slug
    });
    if (slugCheck) {
      data.slug = `${data.slug}${new Date().getTime()}`;
    }
    const feed = await this.feedModel.create({
      ...data,
      fromSource: 'performer',
      fromSourceId
    } as any);
    if (feed.fileIds && feed.fileIds.length) {
      await Promise.all(feed.fileIds.map((fileId) => this.fileService.addRef((fileId as any), {
        itemId: feed._id,
        itemType: REF_TYPE.FEED
      })));
    }
    feed.teaserId && await this.fileService.addRef((feed.teaserId as any), {
      itemId: feed._id,
      itemType: REF_TYPE.FEED
    });
    feed.thumbnailId && await this.fileService.addRef((feed.thumbnailId as any), {
      itemId: feed._id,
      itemType: REF_TYPE.FEED
    });
    if (feed.status === STATUS.ACTIVE) {
      await this.queueEventService.publish(
        new QueueEvent({
          channel: PERFORMER_FEED_CHANNEL,
          eventName: EVENT.CREATED,
          data: new FeedDto(feed)
        })
      );
    }
    // to get notification
    if (feed.type === FEED_TYPE.SCHEDULED_STREAMING) {
      await this.scheduledStreamNotificationModel.create({
        feedId: feed._id,
        performerId: feed.fromSourceId,
        scheduledAt: feed.streamingScheduled,
        notified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return feed;
  }

  public async updateFeed(id: string, user: UserDto, payload: FeedCreatePayload): Promise<any> {
    const feed = await this.feedModel.findById(id);
    if (!feed || ((!user.roles || !user.roles.includes('admin')) && feed.fromSourceId.toString() !== user._id.toString())) throw new EntityNotFoundException();
    const data = { ...payload } as any;
    data.updatedAt = new Date();
    if (!feed.slug) {
      data.slug = `post-${new Date().getTime()}`;
      const slugCheck = await this.feedModel.countDocuments({
        slug: data.slug,
        _id: { $ne: feed._id }
      });
      if (slugCheck) {
        data.slug = `${data.slug}${new Date().getTime()}`;
      }
    }
    const oldStatus = feed.status;
    await this.feedModel.updateOne({ _id: id }, data);
    const newFeed = await this.feedModel.findById(id);
    if (payload.fileIds && payload.fileIds.length) {
      const ids = feed.fileIds.map((_id) => _id.toString());
      const Ids = payload.fileIds.filter((_id) => !ids.includes(_id));
      const deleteIds = feed.fileIds.filter((_id) => !payload.fileIds.includes(_id.toString()));
      await Promise.all(Ids.map((fileId) => this.fileService.addRef((fileId as any), {
        itemId: feed._id,
        itemType: REF_TYPE.FEED
      })));
      await Promise.all(deleteIds.map((_id) => this.fileService.remove(_id)));
    }
    if ((feed.thumbnailId && `${feed.thumbnailId}` !== `${data.thumbnailId}`) || (feed.thumbnailId && !data.thumbnailId)) {
      await this.fileService.remove(feed.thumbnailId);
    }
    if ((feed.teaserId && `${feed.teaserId}` !== `${data.teaserId}`) || (feed.teaserId && !data.teaserId)) {
      await this.fileService.remove(feed.teaserId);
    }
    if (newFeed.type === FEED_TYPE.SCHEDULED_STREAMING) {
      await this.scheduledStreamNotificationModel.updateOne({
        feedId: newFeed._id
      }, {
        performerId: newFeed.fromSourceId,
        notified: false,
        scheduledAt: feed.streamingScheduled,
        updatedAt: new Date()
      }, {
        upsert: true
      });
    }

    await this.queueEventService.publish(
      new QueueEvent({
        channel: PERFORMER_FEED_CHANNEL,
        eventName: EVENT.UPDATED,
        data: {
          ...new FeedDto(newFeed),
          status: newFeed.status,
          oldStatus
        }
      })
    );
    return { updated: true };
  }

  public async deleteFeed(id: string, user: UserDto) {
    if (!isObjectId(id)) throw new EntityNotFoundException();
    const feed = await this.feedModel.findById(id);
    if (!feed) {
      throw new EntityNotFoundException();
    }
    if (user.roles && !user.roles.includes('admin') && `${user._id}` !== `${feed.fromSourceId}`) {
      throw new HttpException('You don\'t have permission to remove this post', 403);
    }
    await this.feedModel.deleteOne({ _id: feed._id });
    await Promise.all([
      feed.thumbnailId && this.fileService.remove(feed.thumbnailId),
      feed.teaserId && this.fileService.remove(feed.teaserId)
    ]);
    await Promise.all(feed.fileIds.map((_id) => this.fileService.remove(_id)));
    await this.queueEventService.publish(
      new QueueEvent({
        channel: PERFORMER_FEED_CHANNEL,
        eventName: EVENT.DELETED,
        data: { ...new FeedDto(feed), user }
      })
    );
    return { success: true };
  }

  public async search(req: FeedSearchRequest, user: UserDto, jwToken: string) {
    const query = {
    } as any;

    if (!user.roles || !user.roles.includes('admin')) {
      query.fromSourceId = user._id;
    }

    if (user.roles && user.roles.includes('admin') && req.performerId) {
      query.fromSourceId = toObjectId(req.performerId);
    }

    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }

    if (req.type) {
      query.type = req.type;
    }

    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
        'i'
      );
      query.text = { $regex: regexp };
    }

    const sort = {
      updatedAt: -1
    } as any;

    const [data, total] = await Promise.all([
      this.feedModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.feedModel.countDocuments(query)
    ]);

    // populate video, photo, etc...
    return {
      data: await this.populateFeedData(data, user, jwToken),
      total
    };
  }

  public async userSearchFeeds(req: FeedSearchRequest, user: UserDto, jwToken: string) {
    const query = {
      status: STATUS.ACTIVE
    } as any;

    // check performer block user
    if (user && !user.isPerformer && !req.performerId) {
      const blocks = await this.blockService.userSearch(user._id);
      const performerIds = blocks?.length > 0 ? blocks.map((b) => b.sourceId) : [];
      query.fromSourceId = { $nin: performerIds };
    }

    if (req.isHome === 'true') {
      const [subscriptions, follows] = await Promise.all([
        user ? this.subscriptionService.findSubscriptionList({
          userId: user._id,
          expiredAt: { $gt: new Date() }
        }) : [],
        user ? this.followService.find({ followerId: user._id }) : []
      ]);
      const subPerIds = subscriptions.map((s) => `${s.performerId}`);
      const folPerIds = follows.map((s) => `${s.followingId}`);
      const performerIds = uniq(subPerIds.concat(folPerIds));
      query.fromSourceId = { $in: performerIds };
      if ((user && user.isPerformer)) delete query.fromSourceId;
    }

    if (req.performerId) {
      query.fromSourceId = toObjectId(req.performerId);
    }

    if (req.type) {
      query.type = req.type;
    }

    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
        'i'
      );
      query.text = { $regex: regexp };
    }
    if (req.fromDate && req.toDate) {
      query.createdAt = {
        $gte: moment(req.fromDate).startOf('day').toDate(),
        $lte: moment(req.toDate).endOf('day').toDate()
      };
    }
    const sort = {
      createdAt: -1
    } as any;

    const [data, total] = await Promise.all([
      this.feedModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.feedModel.countDocuments(query)
    ]);
    // populate video, photo, etc...
    return {
      data: await this.populateFeedData(data, user, jwToken),
      total
    };
  }

  public async checkAuth(req: any, user: UserDto) {
    const { query } = req;
    if (!query.feedId) {
      throw new ForbiddenException();
    }
    if (user.roles && user.roles.indexOf('admin') > -1) {
      return true;
    }
    // check type video
    const feed = await this.feedModel.findById(query.feedId);
    if (!feed) throw new EntityNotFoundException();
    if (user._id.toString() === feed.fromSourceId.toString()) {
      return true;
    }

    // check schedule status
    if (feed.isSchedule && moment(feed.scheduleAt).isBefore(new Date())) {
      throw new ForbiddenException();
    }

    let isSubscribed = false;
    if (!feed.isSale) {
      // check subscription
      const subscribed = await this.subscriptionService.checkSubscribed(
        feed.fromSourceId,
        user._id
      );
      isSubscribed = !!subscribed;
      if (!isSubscribed) {
        throw new ForbiddenException();
      }
      return true;
    } if (feed.isSale) {
      if (!feed.price) {
        return true;
      }
      // check bought
      const bought = await this.paymentTokenService.checkBought(feed, PurchaseItemType.FEED, user);
      if (!bought) {
        throw new ForbiddenException();
      }
      return true;
    }
    throw new ForbiddenException();
  }

  public async createPoll(payload: PollCreatePayload, user: UserDto) {
    const poll = new this.PollVoteModel({
      ...payload,
      createdBy: user.roles && user.roles.includes('admin') && payload.performerId ? payload.performerId : user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await poll.save();
    return new PollDto(poll);
  }

  public async votePollFeed(pollId: string | Types.ObjectId, user: UserDto): Promise<any> {
    const poll = await this.PollVoteModel.findById(pollId);
    if (!poll || !poll.refId) {
      throw new EntityNotFoundException();
    }
    if (moment().isAfter(poll.expiredAt)) {
      throw new PollExpiredException();
    }
    const vote = await this.voteModel.findOne({
      targetSource: POLL_TARGET_SOURCE.FEED,
      refId: poll.refId,
      fromSourceId: user._id
    });

    if (vote) {
      throw new AlreadyVotedException();
    }

    const newVote = await this.voteModel.create({
      targetSource: POLL_TARGET_SOURCE.FEED,
      targetId: pollId,
      refId: poll.refId,
      fromSource: 'user',
      fromSourceId: user._id
    });
    await this.queueEventService.publish(
      new QueueEvent({
        channel: VOTE_FEED_CHANNEL,
        eventName: EVENT.CREATED,
        data: newVote
      })
    );

    return { voted: true };
  }
}
