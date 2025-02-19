import {
  Injectable, Inject
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  AgendaService, QueueEvent, QueueEventService
} from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import {
  SUBSCRIPTION_STATS_JOB, SUBSCRIPTION_STATUS, COUNT_SUBSCRIPTION_STATS_CHANNEL
} from '../constants';
import { SUBSCRIPTION_MODEL_PROVIDER } from '../providers/subscription.provider';
import { SubscriptionModel } from '../models/subscription.model';

@Injectable()
export class CountSubscriptionStatsJob {
  constructor(
    @Inject(SUBSCRIPTION_MODEL_PROVIDER)
    private readonly subscriptionModel: Model<SubscriptionModel>,
    private readonly agenda: AgendaService,
    private readonly queueEventService: QueueEventService
  ) {
    this.defineJobs();
  }

  private async defineJobs() {
    const collection = (this.agenda as any)._collection;
    await collection.deleteMany({
      name: {
        $in: [
          SUBSCRIPTION_STATS_JOB
        ]
      }
    });
    // schedule feed
    this.agenda.define(SUBSCRIPTION_STATS_JOB, {}, this.handleJob.bind(this));
    this.agenda.schedule('10 seconds from now', SUBSCRIPTION_STATS_JOB, {});
  }

  private async handleJob(job: any, done: any) {
    job.schedule('1 hour', { skipImmediate: true });
    await job.save();
    try {
      const subscriptions = await this.subscriptionModel.find({
        status: SUBSCRIPTION_STATUS.DEACTIVATED
      }).lean().sort('createdAt');
      await subscriptions.reduce(async (lp, subscription) => {
        await lp;
        await this.queueEventService.publish(
          new QueueEvent({
            channel: COUNT_SUBSCRIPTION_STATS_CHANNEL,
            eventName: EVENT.UPDATED,
            data: subscription
          })
        );
      }, Promise.resolve());
    } catch {
      job.schedule('10 seconds', { skipImmediate: true });
      await job.save();
    } finally {
      typeof done === 'function' && done();
    }
  }
}
