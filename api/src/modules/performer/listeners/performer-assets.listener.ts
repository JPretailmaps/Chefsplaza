import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import {
  PERFORMER_PHOTO_CHANNEL,
  PERFORMER_PRODUCT_CHANNEL,
  PERFORMER_COUNT_VIDEO_CHANNEL
} from 'src/modules/performer-assets/services';
import { Model, ObjectId } from 'mongoose';
import { PHOTO_STATUS, VIDEO_STATUS, PRODUCT_STATUS } from 'src/modules/performer-assets/constants';
import { EVENT } from 'src/kernel/constants';
import { PERFORMER_FEED_CHANNEL } from 'src/modules/feed/constants';
import { MailerService } from 'src/modules/mailer';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { SUBSCRIPTION_STATUS } from 'src/modules/subscription/constants';
import { flattenDeep } from 'lodash';
import { UserService } from 'src/modules/user/services';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER } from '../providers';

const HANDLE_PHOTO_COUNT_FOR_PERFORMER = 'HANDLE_PHOTO_COUNT_FOR_PERFORMER';
const HANDLE_VIDEO_COUNT_FOR_PERFORMER = 'HANDLE_VIDEO_COUNT_FOR_PERFORMER';
const HANDLE_PRODUCT_COUNT_FOR_PERFORMER = 'HANDLE_PRODUCT_COUNT_FOR_PERFORMER';
const HANDLE_FEED_COUNT_FOR_PERFORMER = 'HANDLE_FEED_COUNT_FOR_PERFORMER';

@Injectable()
export class PerformerAssetsListener {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly performerModel: Model<PerformerModel>,
    private readonly mailerService: MailerService,
    private readonly queueEventService: QueueEventService
  ) {
    this.queueEventService.subscribe(
      PERFORMER_COUNT_VIDEO_CHANNEL,
      HANDLE_VIDEO_COUNT_FOR_PERFORMER,
      this.handleVideoCount.bind(this)
    );

    this.queueEventService.subscribe(
      PERFORMER_PHOTO_CHANNEL,
      HANDLE_PHOTO_COUNT_FOR_PERFORMER,
      this.handlePhotoCount.bind(this)
    );

    this.queueEventService.subscribe(
      PERFORMER_PRODUCT_CHANNEL,
      HANDLE_PRODUCT_COUNT_FOR_PERFORMER,
      this.handleProductCount.bind(this)
    );

    this.queueEventService.subscribe(
      PERFORMER_FEED_CHANNEL,
      HANDLE_FEED_COUNT_FOR_PERFORMER,
      this.handleFeedCount.bind(this)
    );
  }

  public async handlePhotoCount(event: QueueEvent) {
    const { eventName } = event;
    if (![EVENT.CREATED, EVENT.DELETED, EVENT.UPDATED].includes(eventName)) {
      return;
    }
    const { performerId, status, oldStatus } = event.data;
    let increase = 0;

    switch (eventName) {
      case EVENT.CREATED:
        if (status === PHOTO_STATUS.ACTIVE) increase = 1;
        break;
      case EVENT.UPDATED:
        if (
          oldStatus !== PHOTO_STATUS.ACTIVE
            && status === PHOTO_STATUS.ACTIVE
        ) increase = 1;
        if (
          oldStatus === PHOTO_STATUS.ACTIVE
            && status !== PHOTO_STATUS.ACTIVE
        ) increase = -1;
        break;
      case EVENT.DELETED:
        if (status === PHOTO_STATUS.ACTIVE) increase = -1;
        break;
      default:
        break;
    }

    if (increase) {
      await this.performerModel.updateOne(
        { _id: performerId },
        {
          $inc: {
            'stats.totalPhotos': increase
          }
        }
      );
    }
  }

  public async handleVideoCount(event: QueueEvent) {
    const { eventName } = event;
    if (![EVENT.CREATED, EVENT.DELETED, EVENT.UPDATED].includes(eventName)) {
      return;
    }
    const {
      performerId, status, oldStatus, _id: videoId, user
    } = event.data;
    let increase = 0;

    switch (eventName) {
      case EVENT.CREATED:
        if (status === VIDEO_STATUS.ACTIVE) increase = 1;
        break;
      case EVENT.UPDATED:
        if (
          oldStatus !== VIDEO_STATUS.ACTIVE
            && status === VIDEO_STATUS.ACTIVE
        ) increase = 1;
        if (
          oldStatus === VIDEO_STATUS.ACTIVE
            && status !== VIDEO_STATUS.ACTIVE
        ) increase = -1;
        break;
      case EVENT.DELETED:
        if (status === VIDEO_STATUS.ACTIVE) increase = -1;
        break;
      default:
        break;
    }
    if (increase) {
      await this.performerModel.updateOne(
        { _id: performerId },
        {
          $inc: {
            'stats.totalVideos': increase
          }
        }
      );
    }
    if (increase === -1) {
      if (user?.roles.includes('admin')) {
        await this.handleDeleteMailer('video', videoId, performerId);
      }
    }
    if (increase === 1) {
      await this.handleNewMailer('video', videoId, performerId);
    }
  }

  public async handleProductCount(event: QueueEvent) {
    const { eventName } = event;
    if (![EVENT.CREATED, EVENT.DELETED, EVENT.UPDATED].includes(eventName)) {
      return;
    }
    const {
      performerId, status, oldStatus, count, _id: productId, user
    } = event.data;
    if (count) {
      await this.performerModel.updateOne(
        { _id: performerId },
        {
          $inc: {
            'stats.totalProducts': count
          }
        }
      );
      return;
    }
    let increase = 0;

    switch (eventName) {
      case EVENT.CREATED:
        if (status === PRODUCT_STATUS.ACTIVE) increase = 1;
        break;
      case EVENT.UPDATED:
        if (
          oldStatus !== PRODUCT_STATUS.ACTIVE
            && status === PRODUCT_STATUS.ACTIVE
        ) increase = 1;
        if (
          oldStatus === PRODUCT_STATUS.ACTIVE
            && status !== PRODUCT_STATUS.ACTIVE
        ) increase = -1;
        break;
      case EVENT.DELETED:
        if (status === PRODUCT_STATUS.ACTIVE) increase = -1;
        break;
      default:
        break;
    }
    if (increase) {
      await this.performerModel.updateOne(
        { _id: performerId },
        {
          $inc: {
            'stats.totalProducts': increase
          }
        }
      );
    }

    if (increase === -1) {
      if (user?.roles.includes('admin')) {
        await this.handleDeleteMailer('product', productId, performerId);
      }
    }
    if (increase === 1) {
      await this.handleNewMailer('product', productId, performerId);
    }
  }

  public async handleFeedCount(event: QueueEvent) {
    const { eventName } = event;
    if (![EVENT.CREATED, EVENT.UPDATED, EVENT.DELETED].includes(eventName)) {
      return;
    }
    const {
      fromSourceId, count, status, oldStatus, _id: feedId, user
    } = event.data;
    if (count) {
      await this.performerModel.updateOne(
        { _id: fromSourceId },
        {
          $inc: {
            'stats.totalFeeds': count
          }
        }
      );
      return;
    }
    let increase = 0;

    switch (eventName) {
      case EVENT.CREATED:
        if (status === PRODUCT_STATUS.ACTIVE) increase = 1;
        break;
      case EVENT.UPDATED:
        if (
          oldStatus !== PRODUCT_STATUS.ACTIVE
            && status === PRODUCT_STATUS.ACTIVE
        ) increase = 1;
        if (
          oldStatus === PRODUCT_STATUS.ACTIVE
            && status !== PRODUCT_STATUS.ACTIVE
        ) increase = -1;
        break;
      case EVENT.DELETED:
        if (status === PRODUCT_STATUS.ACTIVE) increase = -1;
        break;
      default:
        break;
    }
    if (increase) {
      await this.performerModel.updateOne(
        { _id: fromSourceId },
        {
          $inc: {
            'stats.totalFeeds': increase
          }
        }
      );
    }
    if (increase === -1) {
      if (user?.roles.includes('admin')) {
        await this.handleDeleteMailer('post', feedId, fromSourceId);
      }
    }
    if (increase === 1) {
      await this.handleNewMailer('post', feedId, fromSourceId);
    }
  }

  private async handleDeleteMailer(contentType: string, description: string, performerId) {
    const performer = await this.performerModel.findById(performerId);
    performer && await this.mailerService.send({
      subject: 'Content was deleted',
      to: performer?.email,
      data: {
        contentType,
        description
      },
      template: 'performer-content-deleted'
    });
  }

  private async handleNewMailer(contentType: string, contentId: ObjectId, performerId: ObjectId) {
    const performer = await this.performerModel.findById(performerId);
    const [subscriptions, follows] = await Promise.all([
      this.subscriptionService.findSubscriptionList({ performerId, status: SUBSCRIPTION_STATUS.ACTIVE }),
      this.followService.find({ followingId: performerId })
    ]);
    const userIds = flattenDeep([
      subscriptions.map((s) => `${s.userId}`),
      follows.map((f) => `${f.followerId}`)
    ]);
    const users = await this.userService.findByIds(userIds);
    await users.reduce(async (cb, user) => {
      await this.mailerService.send({
        subject: 'New content',
        to: user?.email,
        data: {
          link: `${process.env.USER_URL}/${contentType}/${contentId}`,
          contentType,
          userName: user?.name || user?.username,
          performerName: performer?.name || performer?.username
        },
        template: 'user-new-content'
      });
    }, Promise.resolve());
  }
}
