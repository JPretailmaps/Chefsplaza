import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { UserDto } from 'src/modules/user/dtos';
import { DELETE_PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { FEED_PROVIDER } from 'src/modules/feed/providers';
import { FeedModel } from 'src/modules/feed/models';
import { PERFORMER_PRODUCT_MODEL_PROVIDER, PERFORMER_GALLERY_MODEL_PROVIDER, PERFORMER_VIDEO_MODEL_PROVIDER } from 'src/modules/performer-assets/providers';
import { GalleryModel, ProductModel, VideoModel } from 'src/modules/performer-assets/models';
import { DELETE_USER_CHANNEL } from 'src/modules/user/constants';
import { flattenDeep, uniq } from 'lodash';
import { REACT_MODEL_PROVIDER } from '../providers/reaction.provider';
import { ReactionModel } from '../models/reaction.model';

const DELETE_PERFORMER_REACTION_TOPIC = 'DELETE_PERFORMER_REACTION_TOPIC';
const DELETE_USER_REACTION_TOPIC = 'DELETE_USER_REACTION_TOPIC';

@Injectable()
export class DeletePerformerReactionListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(REACT_MODEL_PROVIDER)
    private readonly reactionModel: Model<ReactionModel>,
    @Inject(FEED_PROVIDER)
    private readonly feedModel: Model<FeedModel>,
    @Inject(PERFORMER_PRODUCT_MODEL_PROVIDER)
    private readonly productModel: Model<ProductModel>,
    @Inject(PERFORMER_GALLERY_MODEL_PROVIDER)
    private readonly galleryModel: Model<GalleryModel>,
    @Inject(PERFORMER_VIDEO_MODEL_PROVIDER)
    private readonly videoModel: Model<VideoModel>
  ) {
    this.queueEventService.subscribe(
      DELETE_PERFORMER_CHANNEL,
      DELETE_PERFORMER_REACTION_TOPIC,
      this.handleDeletePerformer.bind(this)
    );
    this.queueEventService.subscribe(
      DELETE_USER_CHANNEL,
      DELETE_USER_REACTION_TOPIC,
      this.handleDeleteUser.bind(this)
    );
  }

  private async handleDeletePerformer(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const performer = event.data as UserDto;
    await this.reactionModel.deleteMany({
      objectId: performer._id
    });
    const [feeds, videos, products, galleries] = await Promise.all([
      this.feedModel.find({ fromSourceId: performer._id }),
      this.videoModel.find({ performerId: performer._id }),
      this.productModel.find({ performerId: performer._id }),
      this.galleryModel.find({ performerId: performer._id })
    ]);
    const objectIds = uniq(flattenDeep([
      feeds.map((f) => `${f._id}`),
      videos.map((v) => `${v._id}`),
      galleries.map((g) => `${g._id}`),
      products.map((p) => `${p.performerId}`)
    ]));
    objectIds.length && await this.reactionModel.deleteMany({
      objectId: { $in: objectIds }
    });
  }

  private async handleDeleteUser(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const user = event.data as UserDto;
    await this.reactionModel.deleteMany({
      createdBy: user._id
    });
  }
}
