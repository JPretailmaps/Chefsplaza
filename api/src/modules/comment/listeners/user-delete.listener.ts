import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { UserDto } from 'src/modules/user/dtos';
import { DELETE_PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { DELETE_USER_CHANNEL } from 'src/modules/user/constants';
import { FeedService } from 'src/modules/feed/services';
import { GalleryService, VideoService } from 'src/modules/performer-assets/services';
import { flattenDeep, uniq } from 'lodash';
import { CommentModel } from '../models/comment.model';
import { COMMENT_MODEL_PROVIDER } from '../providers/comment.provider';
import { COMMENT_CHANNEL } from '../contants';
import { CommentDto } from '../dtos/comment.dto';

const DELETE_PERFORMER_COMMENT_TOPIC = 'DELETE_PERFORMER_COMMENT_TOPIC';
const DELETE_USER_COMMENT_TOPIC = 'DELETE_USER_COMMENT_TOPIC';

@Injectable()
export class DeleteUserListener {
  constructor(
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => GalleryService))
    private readonly galleryService: GalleryService,
    private readonly queueEventService: QueueEventService,
    @Inject(COMMENT_MODEL_PROVIDER)
    private readonly commentModel: Model<CommentModel>
  ) {
    this.queueEventService.subscribe(
      DELETE_PERFORMER_CHANNEL,
      DELETE_PERFORMER_COMMENT_TOPIC,
      this.handleDeletePerformer.bind(this)
    );
    this.queueEventService.subscribe(
      DELETE_USER_CHANNEL,
      DELETE_USER_COMMENT_TOPIC,
      this.handleDeleteUser.bind(this)
    );
  }

  private async handleDeletePerformer(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const performer = event.data as UserDto;
    await this.commentModel.deleteMany({
      objectId: performer._id
    });
    await this.commentModel.deleteMany({
      createdBy: performer._id
    });
    const [feeds, videos, galleries] = await Promise.all([
      this.feedService.find({ fromSourceId: performer._id }),
      this.videoService.find({ performerId: performer._id }),
      this.galleryService.find({ performerId: performer._id })
    ]);
    const objectIds = uniq(flattenDeep([
      feeds.map((f) => `${f._id}`),
      videos.map((v) => `${v._id}`),
      galleries.map((g) => `${g._id}`)
    ]));
    objectIds.length && await this.commentModel.deleteMany({
      objectId: { $in: objectIds }
    });
  }

  private async handleDeleteUser(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const user = event.data as UserDto;
    const comments = await this.commentModel.find({ createdBy: user._id });
    await comments.reduce(async (cb, comment) => {
      await cb;
      await this.commentModel.deleteOne({ _id: comment._id });
      await this.queueEventService.publish(
        new QueueEvent({
          channel: COMMENT_CHANNEL,
          eventName: EVENT.DELETED,
          data: new CommentDto(comment)
        })
      );
      return Promise.resolve();
    }, Promise.resolve());
  }
}
