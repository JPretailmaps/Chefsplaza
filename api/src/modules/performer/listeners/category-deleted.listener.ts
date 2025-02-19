import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { DELETE_CATEGORY_CHANNEL } from 'src/modules/performer/constants';
import { EVENT } from 'src/kernel/constants';
import { PerformerService } from '../services';
import { PerformerCategoryDto } from '../dtos';

const DELETE_CATEGORY_TOPIC = 'DELETE_CATEGORY_TOPIC';

@Injectable()
export class CategoryDeletedListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService
  ) {
    this.queueEventService.subscribe(
      DELETE_CATEGORY_CHANNEL,
      DELETE_CATEGORY_TOPIC,
      this.handler.bind(this)
    );
  }

  public async handler(event: QueueEvent) {
    if (![EVENT.DELETED].includes(event.eventName)) {
      return;
    }
    const {
      _id: categoryId
    } = event.data as PerformerCategoryDto;
    await this.performerService.updatePerformerCategory(categoryId);
  }
}
