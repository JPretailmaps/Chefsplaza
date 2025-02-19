import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { DELETE_PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { PerformerDto } from 'src/modules/performer/dtos';
import { DELETE_USER_CHANNEL } from 'src/modules/user/constants';
import { FOLLOW_MODEL_PROVIDER } from '../providers';
import { FollowModel } from '../models/follow.model';

const DELETE_PERFORMER_FOLLOW_TOPIC = 'DELETE_PERFORMER_FOLLOW_TOPIC';
const DELETE_USER_FOLLOW_TOPIC = 'DELETE_USER_FOLLOW_TOPIC';

@Injectable()
export class DeletePerformerFollowListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(FOLLOW_MODEL_PROVIDER)
    private readonly followModel: Model<FollowModel>
  ) {
    this.queueEventService.subscribe(
      DELETE_PERFORMER_CHANNEL,
      DELETE_PERFORMER_FOLLOW_TOPIC,
      this.handleDeletePerformer.bind(this)
    );
    this.queueEventService.subscribe(
      DELETE_USER_CHANNEL,
      DELETE_USER_FOLLOW_TOPIC,
      this.handleDeleteUser.bind(this)
    );
  }

  private async handleDeletePerformer(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const performer = event.data as PerformerDto;
    await this.followModel.deleteMany({
      followingId: performer._id
    });
  }

  private async handleDeleteUser(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const user = event.data as PerformerDto;
    await this.followModel.deleteMany({
      followerId: user._id
    });
  }
}
