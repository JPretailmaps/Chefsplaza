import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { COMMENT_CHANNEL, OBJECT_TYPE } from 'src/modules/comment/contants';
import { EVENT } from 'src/kernel/constants';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { FeedService } from '../services/feed.service';

const COMMENT_FEED_CHANNEL = 'COMMENT_FEED_CHANNEL';

@Injectable()
export class CommentFeedListener {
  constructor(
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly queueEventService: QueueEventService,
    private readonly feedService: FeedService
  ) {
    this.queueEventService.subscribe(
      COMMENT_CHANNEL,
      COMMENT_FEED_CHANNEL,
      this.handleCommentFeed.bind(this)
    );
  }

  public async handleCommentFeed(event: QueueEvent) {
    if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
      return;
    }
    const { objectId: feedId, objectType } = event.data;
    if (objectType === OBJECT_TYPE.FEED) {
      await this.feedService.handleCommentStat(
        feedId,
        event.eventName === EVENT.CREATED ? 1 : -1
      );
    } else if (objectType === OBJECT_TYPE.COMMENT) {
      const comment = await this.commentService.findById(feedId);
      if (comment) {
        await this.feedService.handleCommentStat(
          comment.objectId,
          event.eventName === EVENT.CREATED ? 1 : -1
        );
      }
    }
  }
}
