import {
  Injectable, Inject
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  QueueEventService,
  QueueEvent,
  AgendaService
} from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { VideoDto } from '../dtos';
import { VIDEO_STATUS } from '../constants';
import { VideoModel } from '../models';
import { PERFORMER_VIDEO_MODEL_PROVIDER } from '../providers';

export const PERFORMER_COUNT_VIDEO_CHANNEL = 'PERFORMER_COUNT_VIDEO_CHANNEL';
const SCHEDULE_VIDEO_AGENDA = 'SCHEDULE_VIDEO_AGENDA';

@Injectable()
export class ScheduleVideosAgendaJob {
  constructor(
    @Inject(PERFORMER_VIDEO_MODEL_PROVIDER)
    private readonly PerformerVideoModel: Model<VideoModel>,
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
          SCHEDULE_VIDEO_AGENDA
        ]
      }
    });

    this.agenda.define(SCHEDULE_VIDEO_AGENDA, {}, this.handlerSchedule.bind(this));
    this.agenda.schedule('5 seconds from now', SCHEDULE_VIDEO_AGENDA, {});
  }

  private async handlerSchedule(job: any, done: any) {
    job.schedule('5 minutes', { skipImmediate: true });
    await job.save();
    try {
      const videos = await this.PerformerVideoModel.find({
        isSchedule: true,
        scheduledAt: { $lte: new Date() }
      }).lean();
      await videos.reduce(async (lp, video) => {
        await lp;
        const v = new VideoDto(video);
        await this.PerformerVideoModel.updateOne(
          {
            _id: v._id
          },
          {
            isSchedule: false,
            status: VIDEO_STATUS.ACTIVE,
            updatedAt: new Date()
          }
        );
        const oldStatus = video.status;
        await this.queueEventService.publish(
          new QueueEvent({
            channel: PERFORMER_COUNT_VIDEO_CHANNEL,
            eventName: EVENT.UPDATED,
            data: {
              ...v,
              oldStatus
            }
          })
        );
      }, Promise.resolve());
    } catch {
      job.schedule('20 seconds', { skipImmediate: true });
      await job.save();
    } finally {
      typeof done === 'function' && done();
    }
  }
}
