import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { REACTION_CHANNEL, REACTION_TYPE, REACTION } from 'src/modules/reaction/constants';
import { EVENT } from 'src/kernel/constants';
import { MailerService } from 'src/modules/mailer';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { ReactionDto } from 'src/modules/reaction/dtos/reaction.dto';
import { GalleryService, ProductService } from '../services';
import { VideoService } from '../services/video.service';

const REACTION_ASSETS_TOPIC = 'REACTION_ASSETS_TOPIC';
@Injectable()
export class ReactionAssetsListener {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly queueEventService: QueueEventService,
    private readonly videoService: VideoService,
    private readonly galleryService: GalleryService,
    private readonly productService: ProductService,
    private readonly mailerService: MailerService
  ) {
    this.queueEventService.subscribe(
      REACTION_CHANNEL,
      REACTION_ASSETS_TOPIC,
      this.handleReaction.bind(this)
    );
  }

  public async handleReaction(event: QueueEvent) {
    if (![EVENT.CREATED, EVENT.DELETED].includes(event.eventName)) {
      return;
    }
    const {
      objectId, objectType, action, createdBy
    } = event.data as ReactionDto;
    if (objectType === REACTION_TYPE.VIDEO) {
      switch (action) {
        case REACTION.LIKE:
          // eslint-disable-next-line no-case-declarations
          const [user, video] = await Promise.all([
            this.userService.findById(createdBy),
            this.videoService.findById(objectId)
          ]);
          await this.videoService.increaseLike(
            objectId,
            event.eventName === EVENT.CREATED ? 1 : -1
          );
          // eslint-disable-next-line no-case-declarations
          const performer = video && await this.performerService.findById(video.performerId);
          performer?.email && await this.mailerService.send({
            subject: 'Like content',
            to: performer?.email,
            data: {
              contentType: 'video',
              userName: user?.name || user?.username
            },
            template: 'performer-like-content'
          });
          break;
        case REACTION.BOOKMARK:
          await this.videoService.increaseFavourite(
            objectId,
            event.eventName === EVENT.CREATED ? 1 : -1
          );
          break;
        default: break;
      }
    }
    if (objectType === REACTION_TYPE.GALLERY) {
      switch (action) {
        case REACTION.LIKE:
          await this.galleryService.updateLikeStats(
            objectId,
            event.eventName === EVENT.CREATED ? 1 : -1
          );
          break;
        case REACTION.BOOKMARK:
          await this.galleryService.updateBookmarkStats(
            objectId,
            event.eventName === EVENT.CREATED ? 1 : -1
          );
          break;
        default: break;
      }
    }
    if (objectType === REACTION_TYPE.PRODUCT) {
      switch (action) {
        case REACTION.LIKE:
          await this.productService.updateLikeStats(
            objectId,
            event.eventName === EVENT.CREATED ? 1 : -1
          );
          break;
        case REACTION.BOOKMARK:
          await this.productService.updateBookmarkStats(
            objectId,
            event.eventName === EVENT.CREATED ? 1 : -1
          );
          break;
        default: break;
      }
    }
  }
}
