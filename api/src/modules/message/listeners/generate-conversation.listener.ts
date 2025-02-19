import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { EVENT } from 'src/kernel/constants';
import { NEW_SUBSCRIPTION_CHANNEL } from 'src/modules/subscription/constants';
import { SubscriptionDto } from 'src/modules/subscription/dtos/subscription.dto';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { ConversationModel } from '../models';
import { CONVERSATION_MODEL_PROVIDER } from '../providers';
import { CONVERSATION_TYPE } from '../constants';

const NEW_CONVERSATION_TOPIC = 'NEW_CONVERSATION_TOPIC';

@Injectable()
export class NewSubscriptionListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(CONVERSATION_MODEL_PROVIDER)
    private readonly conversationModel: Model<ConversationModel>
  ) {
    this.queueEventService.subscribe(
      NEW_SUBSCRIPTION_CHANNEL,
      NEW_CONVERSATION_TOPIC,
      this.handleData.bind(this)
    );
  }

  private async handleData(event: QueueEvent): Promise<void> {
    if (event.eventName !== EVENT.CREATED) return;
    const subscription = event.data as SubscriptionDto;
    let conversation = await this.conversationModel
      .findOne({
        type: CONVERSATION_TYPE.PRIVATE,
        recipients: {
          $all: [
            {
              source: 'user',
              sourceId: toObjectId(subscription.userId)
            },
            {
              source: 'performer',
              sourceId: toObjectId(subscription.performerId)
            }
          ]
        }
      })
      .lean()
      .exec();
    if (!conversation) {
      conversation = await this.conversationModel.create({
        type: CONVERSATION_TYPE.PRIVATE,
        recipients: [
          {
            source: 'user',
            sourceId: toObjectId(subscription.userId)
          },
          {
            source: 'performer',
            sourceId: toObjectId(subscription.performerId)
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
}
