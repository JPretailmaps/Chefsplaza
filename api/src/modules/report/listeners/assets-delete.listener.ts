import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { DELETED_ASSETS_CHANNEL } from 'src/modules/performer-assets/constants';
import { REPORT_MODEL_PROVIDER } from '../providers';
import { ReportModel } from '../models/report.model';

const DELETE_ASSETS_REPORT_TOPIC = 'DELETE_ASSETS_REPORT_TOPIC';

@Injectable()
export class DeleteAssetsListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(REPORT_MODEL_PROVIDER)
    private readonly reportModel: Model<ReportModel>
  ) {
    this.queueEventService.subscribe(
      DELETED_ASSETS_CHANNEL,
      DELETE_ASSETS_REPORT_TOPIC,
      this.handleDeleteData.bind(this)
    );
  }

  private async handleDeleteData(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.DELETED) return;
    const { _id } = event.data;
    await this.reportModel.deleteMany({
      targetId: _id
    });
  }
}
