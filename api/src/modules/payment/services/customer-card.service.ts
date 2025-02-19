import {
  Injectable, Inject, forwardRef
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDto } from 'src/modules/user/dtos';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { EntityNotFoundException } from 'src/kernel';
import { PAYMENT_CUSTOMER_MODEL_PROVIDER, PAYMENT_CARD_MODEL_PROVIDER } from '../providers';
import { PaymentCustomerModel, PaymentCardModel } from '../models';
import { StripeService } from './stripe.service';

@Injectable()
export class CustomerCardService {
  constructor(
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    @Inject(PAYMENT_CUSTOMER_MODEL_PROVIDER)
    private readonly paymentCustomerModel: Model<PaymentCustomerModel>,
    @Inject(PAYMENT_CARD_MODEL_PROVIDER)
    private readonly paymentCardModel: Model<PaymentCardModel>
  ) { }

  public findOneCustomer(query: any) {
    return this.paymentCustomerModel.findOne(query);
  }

  public retrieveCustomer(query: any) {
    return this.paymentCustomerModel.findOne(query);
  }

  public createCustomer(payload: any) {
    return this.paymentCustomerModel.create(payload);
  }

  public findOneCard(query: any) {
    return this.paymentCardModel.findOne(query);
  }

  public async updateOneCard(query: any, payload: any) {
    await this.paymentCardModel.updateOne(query, payload);
  }

  public retrieveCard(query: any) {
    return this.paymentCardModel.findOne(query);
  }

  public createCard(payload: any) {
    return this.paymentCardModel.create(payload);
  }

  public async deleteCard(id: string, user: UserDto) {
    const card = await this.paymentCardModel.findById(id);
    if (card.paymentGateway === 'stripe') {
      await this.stripeService.removeCard(user, card.token);
    }
    if (!card) throw new EntityNotFoundException();
    await this.paymentCardModel.deleteOne({ _id: card._id });
    return { deleted: true };
  }

  public async findCards(req: any, user: UserDto) {
    const query = {
      sourceId: user._id
    } as any;
    if (req.paymentGateway) {
      query.paymentGateway = req.paymentGateway;
    }
    if (req.paymentGateway === 'stripe') {
      const stripeSecretKey = SettingService.getValueByKey(SETTING_KEYS.STRIPE_SECRET_KEY);
      query.isProduction = stripeSecretKey.includes('live');
    }
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || -1
    };
    const [data, total] = await Promise.all([
      this.paymentCardModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.paymentCardModel.countDocuments(query)
    ]);
    return {
      data, total
    };
  }
}
