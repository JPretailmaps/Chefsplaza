/* eslint-disable no-param-reassign */
import {
  Injectable, Inject, forwardRef
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  AgendaService
} from 'src/kernel';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { PerformerService } from 'src/modules/performer/services';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { uniq } from 'lodash';
import moment = require('moment');
import { SCHEDULED_STREAM_NOTIFICATION_PROVIDER } from '../providers';
import { ScheduledStreamNotificationModel } from '../models';
import {
  SCHEDULED_STREAM_NOTIFICATION_AGENDA
} from '../constants';

@Injectable()
export class ScheduledStreamNofificationAgendaJob {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(SCHEDULED_STREAM_NOTIFICATION_PROVIDER)
    private readonly scheduledStreamNotificationModel: Model<ScheduledStreamNotificationModel>,
    private readonly mailerService: MailerService,
    private readonly agenda: AgendaService
  ) {
    this.defineJobs();
  }

  private async defineJobs() {
    const collection = (this.agenda as any)._collection;
    await collection.deleteMany({
      name: {
        $in: [
          SCHEDULED_STREAM_NOTIFICATION_AGENDA
        ]
      }
    });
    // schedule feed
    this.agenda.define(SCHEDULED_STREAM_NOTIFICATION_AGENDA, {}, this.handleMailer.bind(this));
    this.agenda.schedule('10 seconds from now', SCHEDULED_STREAM_NOTIFICATION_AGENDA, {});
  }

  private async handleMailer(job: any, done: any) {
    job.schedule('5 minutes', { skipImmediate: true });
    await job.save();
    try {
      const notifications = await this.scheduledStreamNotificationModel.find({
        notified: false,
        scheduledAt: {
          $gte: moment().startOf('day').toDate(),
          $lte: moment().add(1, 'day').endOf('day').toDate()
        }
      });
      const performerIds = uniq(notifications.map((s) => `${s.performerId}`));
      if (!performerIds.length) return;
      const performers = await this.performerService.findByIds(performerIds);
      await notifications.reduce(async (lp, notification) => {
        await lp;
        const [subs, follows] = await Promise.all([
          this.subscriptionService.findSubscriptionList({
            performerId: notification.performerId
          }),
          this.followService.find({
            followingId: notification.performerId
          })
        ]);
        const suids = subs.map((s) => `${s.userId}`);
        const fuids = follows.map((s) => `${s.followerId}`);
        if (!suids.length && !fuids.length) return Promise.resolve();
        const users = await this.userService.findByIds(uniq([...suids, ...fuids]));
        const performer = performers.find((s) => `${s._id}` === `${notification.performerId}`);
        // notify to performer
        performer?.email && await this.mailerService.send({
          subject: 'Scheduled stream notification',
          to: performer.email,
          data: {
            performerName: performer?.name || performer?.username || `${performer?.firstName} ${performer?.lastName}`,
            scheduledAt: `${moment(notification.scheduledAt).utc().format('lll')} UTC`
          },
          template: 'performer-scheduled-streaming-notification'
        });
        // notify to users
        await users.reduce(async (cb, user) => {
          await cb;
          user?.email && await this.mailerService.send({
            subject: 'Scheduled stream notification',
            to: user.email,
            data: {
              performerName: performer?.name || performer?.username || `${performer?.firstName} ${performer?.lastName}`,
              userName: user?.name || user?.username || `${user?.firstName || 'there'}`,
              scheduledAt: `${moment(notification.scheduledAt).utc().format('lll')} UTC`,
              link: `${process.env.USER_URL}/streaming/${performer?.username || performer?._id}`
            },
            template: 'scheduled-streaming-notification'
          });
        }, Promise.resolve());
        // email
        notification.notified = true;
        notification.updatedAt = new Date();
        await notification.save();
        return Promise.resolve();
      }, Promise.resolve());
    } finally {
      typeof done === 'function' && done();
    }
  }
}
