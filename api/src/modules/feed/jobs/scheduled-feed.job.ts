import {
  Injectable, Inject
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  AgendaService, QueueEventService, QueueEvent
} from 'src/kernel';
import { EVENT, STATUS } from 'src/kernel/constants';
import { FeedDto } from '../dtos';
import {
  PERFORMER_FEED_CHANNEL, SCHEDULE_FEED_AGENDA
} from '../constants';
import { FeedModel } from '../models';
import { FEED_PROVIDER } from '../providers';

@Injectable()
export class ScheduledFeedAgendaJob {
  constructor(
    @Inject(FEED_PROVIDER)
    private readonly feedModel: Model<FeedModel>,
    private readonly queueEventService: QueueEventService,
    private readonly agenda: AgendaService
  ) {
    this.defineJobs();
  }

  private async defineJobs() {
    const collection = (this.agenda as any)._collection;
    await collection.deleteMany({
      name: {
        $in: [
          SCHEDULE_FEED_AGENDA
        ]
      }
    });
    // schedule feed
    this.agenda.define(SCHEDULE_FEED_AGENDA, {}, this.scheduleFeed.bind(this));
    this.agenda.schedule('10 seconds from now', SCHEDULE_FEED_AGENDA, {});
  }

  private async scheduleFeed(job: any, done: any) {
    job.schedule('5 minutes', { skipImmediate: true });
    await job.save();
    try {
      const feeds = await this.feedModel.find({
        isSchedule: true,
        scheduleAt: { $lte: new Date() }
      }).lean();
      await feeds.reduce(async (lp, feed) => {
        await lp;
        const v = new FeedDto(feed);
        await this.feedModel.updateOne(
          {
            _id: v._id
          },
          {
            isSchedule: false,
            status: STATUS.ACTIVE,
            updatedAt: new Date()
          }
        );
        const oldStatus = feed.status;
        return this.queueEventService.publish(
          new QueueEvent({
            channel: PERFORMER_FEED_CHANNEL,
            eventName: EVENT.UPDATED,
            data: {
              ...v,
              status: STATUS.ACTIVE,
              oldStatus
            }
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
