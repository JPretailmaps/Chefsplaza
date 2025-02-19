import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { COUNT_SUBSCRIPTION_STATS_CHANNEL, SUBSCRIPTION_STATUS } from 'src/modules/subscription/constants';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { UserModel } from '../models';
import { USER_MODEL_PROVIDER } from '../providers';

const HANDLE_USER_SUBSCRIPTION_TOPIC = 'HANDLE_USER_SUBSCRIPTION_TOPIC';

@Injectable()
export class UserSubscriptionStatsListener {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    private readonly queueEventService: QueueEventService,
    @Inject(USER_MODEL_PROVIDER)
    private readonly userModel: Model<UserModel>
  ) {
    this.queueEventService.subscribe(
      COUNT_SUBSCRIPTION_STATS_CHANNEL,
      HANDLE_USER_SUBSCRIPTION_TOPIC,
      this.handler.bind(this)
    );
  }

  private async handler(event: QueueEvent): Promise<void> {
    const { userId } = event.data as SubscriptionModel;
    const subscriptions = await this.subscriptionService.findSubscriptionList({
      userId,
      status: SUBSCRIPTION_STATUS.ACTIVE
    });
    await this.userModel.updateOne({ _id: userId }, {
      'stats.totalSubscriptions': subscriptions.length
    });
  }
}
