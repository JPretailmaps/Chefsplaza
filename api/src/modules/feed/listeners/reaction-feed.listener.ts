import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { REACTION_CHANNEL, REACTION_TYPE, REACTION } from 'src/modules/reaction/constants';
import { EVENT } from 'src/kernel/constants';
import { PerformerService } from 'src/modules/performer/services';
import { Model } from 'mongoose';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { ReactionDto } from 'src/modules/reaction/dtos/reaction.dto';
import { FeedModel } from '../models/feed.model';
import { FEED_PROVIDER } from '../providers';

const REACTION_FEED_CHANNEL = 'REACTION_FEED_CHANNEL';

@Injectable()
export class ReactionFeedListener {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    private readonly queueEventService: QueueEventService,
    @Inject(FEED_PROVIDER)
    private readonly feedModel: Model<FeedModel>,
    private readonly mailerService: MailerService
  ) {
    this.queueEventService.subscribe(
      REACTION_CHANNEL,
      REACTION_FEED_CHANNEL,
      this.handleReactFeed.bind(this)
    );
  }

  public async handleReactFeed(event: QueueEvent) {
    if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
      return;
    }
    const {
      objectId, objectType, action, createdBy
    } = event.data as ReactionDto;
    if (![REACTION_TYPE.FEED].includes(objectType) || action !== REACTION.LIKE) {
      return;
    }
    if (REACTION.LIKE && event.eventName === EVENT.CREATED) {
      const feed = await this.feedModel.findById(objectId);
      if (feed) {
        await this.feedModel.updateOne({ _id: objectId }, { $inc: { totalLike: 1 } });
        await this.performerService.updateLikeStat(feed.fromSourceId, 1);
        const [performer, user] = await Promise.all([
          this.performerService.findById(feed.fromSourceId),
          this.userService.findById(createdBy)
        ]);
        performer?.email && await this.mailerService.send({
          subject: 'Like content',
          to: performer?.email,
          data: {
            contentType: 'post',
            userName: user?.name || user?.username
          },
          template: 'performer-like-content'
        });
      }
    }
    if (REACTION.LIKE && event.eventName === EVENT.DELETED) {
      const feed = await this.feedModel.findById(objectId);
      if (feed) {
        await this.feedModel.updateOne({ _id: objectId }, { $inc: { totalLike: -1 } });
        await this.performerService.updateLikeStat(feed.fromSourceId, -1);
      }
    }
  }
}
