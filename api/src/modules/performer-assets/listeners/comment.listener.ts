import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { COMMENT_CHANNEL, OBJECT_TYPE } from 'src/modules/comment/contants';
import { EVENT } from 'src/kernel/constants';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { CommentDto } from 'src/modules/comment/dtos/comment.dto';
import { VideoService } from '../services/video.service';
import { GalleryService, ProductService } from '../services';

const COMMENT_ASSETS_TOPIC = 'COMMENT_ASSETS_TOPIC';

@Injectable()
export class CommentAssetsListener {
  constructor(
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly queueEventService: QueueEventService,
    private readonly videoService: VideoService,
    private readonly productService: ProductService,
    private readonly galleryService: GalleryService
  ) {
    this.queueEventService.subscribe(
      COMMENT_CHANNEL,
      COMMENT_ASSETS_TOPIC,
      this.handleComment.bind(this)
    );
  }

  public async handleComment(event: QueueEvent) {
    if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
      return;
    }
    const { objectId, objectType } = event.data;
    if (objectType === OBJECT_TYPE.VIDEO) {
      await this.videoService.increaseComment(
        objectId,
        event.eventName === EVENT.CREATED ? 1 : -1
      );
    }
    if (objectType === OBJECT_TYPE.PRODUCT) {
      await this.productService.updateCommentStats(
        objectId,
        event.eventName === EVENT.CREATED ? 1 : -1
      );
    }
    if (objectType === OBJECT_TYPE.GALLERY) {
      await this.galleryService.updateCommentStats(
        objectId,
        event.eventName === EVENT.CREATED ? 1 : -1
      );
    }
    if (objectType === OBJECT_TYPE.COMMENT) {
      const comment = await this.commentService.findById(objectId);
      if (comment) {
        await this.handleComment(new QueueEvent({
          channel: COMMENT_CHANNEL,
          eventName: event.eventName,
          data: new CommentDto(comment)
        }));
      }
    }
  }
}
