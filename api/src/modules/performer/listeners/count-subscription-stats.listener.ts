import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { COUNT_SUBSCRIPTION_STATS_CHANNEL, SUBSCRIPTION_STATUS } from 'src/modules/subscription/constants';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER } from '../providers';

const HANDLE_PERFORMER_SUBSCRIPTION_TOPIC = 'HANDLE_PERFORMER_SUBSCRIPTION_TOPIC';

@Injectable()
export class PerformerSubscriptionStatsListener {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    private readonly queueEventService: QueueEventService,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly performerModel: Model<PerformerModel>
  ) {
    this.queueEventService.subscribe(
      COUNT_SUBSCRIPTION_STATS_CHANNEL,
      HANDLE_PERFORMER_SUBSCRIPTION_TOPIC,
      this.handler.bind(this)
    );
  }

  private async handler(event: QueueEvent): Promise<void> {
    const { performerId } = event.data as SubscriptionModel;
    const subscriptions = await this.subscriptionService.findSubscriptionList({
      performerId,
      status: SUBSCRIPTION_STATUS.ACTIVE
    });
    await this.performerModel.updateOne({ _id: performerId }, {
      'stats.subscribers': subscriptions.length
    });
  }
}
