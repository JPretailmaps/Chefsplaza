import { Injectable, Inject } from '@nestjs/common';
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { SETTING_CHANNEL, SETTING_KEYS } from 'src/modules/settings/constants';
import { SettingDto } from 'src/modules/settings/dtos';
import { SettingService } from 'src/modules/settings';
import { PaymentCardModel, PaymentCustomerModel, SubscriptionPlanModel } from '../models';
import {
  PAYMENT_CARD_MODEL_PROVIDER,
  PAYMENT_CUSTOMER_MODEL_PROVIDER,
  SUBSCRIPTION_PLAN_MODEL_PROVIDER
} from '../providers';

const PAYMENT_UPDATE_TOPIC = 'STRIPE_UPDATE_TOPIC';

@Injectable()
export class SettingsUpdatedListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    @Inject(PAYMENT_CARD_MODEL_PROVIDER)
    private readonly paymentCardModel: Model<PaymentCardModel>,
    @Inject(PAYMENT_CUSTOMER_MODEL_PROVIDER)
    private readonly paymentCustomerModel: Model<PaymentCustomerModel>,
    @Inject(SUBSCRIPTION_PLAN_MODEL_PROVIDER)
    private readonly subscriptionPlanModel: Model<SubscriptionPlanModel>
  ) {
    this.queueEventService.subscribe(
      SETTING_CHANNEL,
      PAYMENT_UPDATE_TOPIC,
      this.subscribe.bind(this)
    );
  }

  private async subscribe(event: QueueEvent): Promise<void> {
    const { key, value, oldValue } = event.data as SettingDto;
    if (event.eventName !== 'update') return;
    if (![
      SETTING_KEYS.PAYMENT_GATEWAY,
      SETTING_KEYS.STRIPE_PUBLISHABLE_KEY,
      SETTING_KEYS.STRIPE_SECRET_KEY
    ].includes(key)) {
      return;
    }
    if (`${value}` === `${oldValue}`) return;

    await this.paymentCardModel.deleteMany({ paymentGateway: 'stripe' });
    await this.paymentCustomerModel.deleteMany({});
    await this.subscriptionPlanModel.deleteMany({});
  }
}
