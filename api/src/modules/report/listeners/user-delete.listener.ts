import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { UserDto } from 'src/modules/user/dtos';
import { DELETE_PERFORMER_CHANNEL } from 'src/modules/performer/constants';
import { DELETE_USER_CHANNEL } from 'src/modules/user/constants';
import { REPORT_MODEL_PROVIDER } from '../providers';
import { ReportModel } from '../models/report.model';

const DELETE_PERFORMER_REPORT_TOPIC = 'DELETE_PERFORMER_REPORT_TOPIC';
const DELETE_USER_REPORT_TOPIC = 'DELETE_USER_REPORT_TOPIC';

@Injectable()
export class DeleteUserReactionListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(REPORT_MODEL_PROVIDER)
    private readonly reportModel: Model<ReportModel>
  ) {
    this.queueEventService.subscribe(
      DELETE_PERFORMER_CHANNEL,
      DELETE_PERFORMER_REPORT_TOPIC,
      this.handleDeletePerformer.bind(this)
    );
    this.queueEventService.subscribe(
      DELETE_USER_CHANNEL,
      DELETE_USER_REPORT_TOPIC,
      this.handleDeleteUser.bind(this)
    );
  }

  private async handleDeletePerformer(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const performer = event.data as UserDto;
    await this.reportModel.deleteMany({
      sourceId: performer._id
    });
    await this.reportModel.deleteMany({
      performerId: performer._id
    });
  }

  private async handleDeleteUser(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const user = event.data as UserDto;
    await this.reportModel.deleteMany({
      sourceId: user._id
    });
  }
}
