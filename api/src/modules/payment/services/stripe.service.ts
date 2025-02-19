import {
  Injectable, Inject, HttpException, forwardRef
} from '@nestjs/common';
import { Model } from 'mongoose';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { UserDto } from 'src/modules/user/dtos';
import Stripe from 'stripe';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { PerformerDto } from 'src/modules/performer/dtos';
import { SUBSCRIPTION_PLAN_MODEL_PROVIDER } from '../providers';
import { PaymentTransactionModel } from '../models';
import { AuthoriseCardPayload } from '../payloads/authorise-card.payload';
import { PAYMENT_TYPE } from '../constants';
import { SubscriptionPlanModel } from '../models/subscription-plan.model';
import { CustomerCardService } from './customer-card.service';

@Injectable()
export class StripeService {
  constructor(
    @Inject(forwardRef(() => CustomerCardService))
    private readonly customerCardService: CustomerCardService,
    @Inject(SUBSCRIPTION_PLAN_MODEL_PROVIDER)
    private readonly subscriptionPlanModel: Model<SubscriptionPlanModel>
  ) { }

  private getCredentials() {
    const secretKey = SettingService.getValueByKey(SETTING_KEYS.STRIPE_SECRET_KEY);
    const stripe = new Stripe(secretKey, {
      apiVersion: '2022-11-15'
    });
    return stripe;
  }

  private checkProduction() {
    const secretKey = SettingService.getValueByKey(SETTING_KEYS.STRIPE_SECRET_KEY);
    return secretKey.includes('live');
  }

  private async retrieveCustomer(user: UserDto) {
    const stripe = this.getCredentials();
    const isProduction = this.checkProduction();
    const query = {
      source: user.isPerformer ? 'performer' : 'user',
      sourceId: user._id,
      paymentGateway: 'stripe',
      isProduction
    };
    let customer = await this.customerCardService.findOneCustomer(query);
    if (customer) return customer;
    const data = await stripe.customers.create({
      email: user.email,
      name: (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`) || user.name || user.username,
      description: `Create customer ${user.name || user.username}`
    });
    customer = await this.customerCardService.createCustomer({
      ...query,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerId: data.id,
      name: data.name,
      email: data.email
    });
    return customer;
  }

  public async authoriseCard(user: UserDto, payload: AuthoriseCardPayload) {
    const {
      last4Digits, holderName, year, month, brand, token
    } = payload;
    try {
      const stripe = this.getCredentials();
      // find & update customer Id
      const customer = await this.retrieveCustomer(user);
      const query = {
        source: user.isPerformer ? 'performer' : 'user',
        sourceId: user._id,
        customerId: customer.customerId,
        paymentGateway: 'stripe',
        isProduction: this.checkProduction(),
        last4Digits,
        year,
        month,
        brand
      };
      let card = await this.customerCardService.findOneCard(query);
      if (card) throw new HttpException('Duplicated payment card!', 422);
      const data = await stripe.customers.createSource(customer.customerId, {
        source: token
      });
      card = await this.customerCardService.createCard({
        ...query,
        createdAt: new Date(),
        updatedAt: new Date(),
        holderName: holderName || (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`) || user.name,
        token: data.id
      });
      return card;
    } catch (e) {
      throw new HttpException(e?.raw?.message || e?.response || e || 'Authorise card on Stripe error, please try again later', 400);
    }
  }

  public async removeCard(user: UserDto, cardId: string) {
    try {
      const stripe = this.getCredentials();
      const customer = await this.retrieveCustomer(user);
      const deleted = await stripe.customers.deleteSource(customer.customerId, cardId);
      return deleted;
    } catch (e) {
      throw new HttpException(e?.raw?.message || e?.response || 'Remove card on Stripe error, please try again later', 400);
    }
  }

  public async getStripeProduct(performer: PerformerDto, type: string) {
    try {
      const stripe = this.getCredentials();
      // eslint-disable-next-line no-nested-ternary
      const name = type === PAYMENT_TYPE.MONTHLY_SUBSCRIPTION ? 'Monthly subscription' : type === PAYMENT_TYPE.YEARLY_SUBSCRIPTION ? 'Yearly subscription' : `Free subscription in ${performer?.durationFreeSubscriptionDays} days`;
      // eslint-disable-next-line no-nested-ternary
      const price = type === PAYMENT_TYPE.MONTHLY_SUBSCRIPTION ? performer.monthlyPrice : type === PAYMENT_TYPE.YEARLY_SUBSCRIPTION ? performer.yearlyPrice : 0;
      const plan = await this.subscriptionPlanModel.findOne({
        performerId: performer._id,
        subscriptionType: type,
        // eslint-disable-next-line no-nested-ternary
        price
      });
      if (plan) return plan;
      const stripeProduct = await stripe.products.create({
        name: `${name} ${performer?.name || performer?.username || `${performer?.firstName} ${performer?.lastName}`}`,
        description: `${name} ${performer?.name || performer?.username || `${performer?.firstName} ${performer?.lastName}`}`
      });
      const newProduct = await this.subscriptionPlanModel.create({
        performerId: performer._id,
        subscriptionType: type,
        price,
        planId: stripeProduct.id,
        metaData: stripeProduct
      });
      return newProduct;
    } catch (e) {
      throw new HttpException(e?.raw?.message || e?.response || 'Create a subscription plan on Stripe error, please try again later', 400);
    }
  }

  public async createSubscriptionPlan(transaction: PaymentTransactionModel, performer: PerformerDto, user: UserDto, cardId: string) {
    try {
      const stripe = this.getCredentials();
      const product = await this.getStripeProduct(performer, transaction.type);
      const customer = await this.retrieveCustomer(user);
      // monthly subscription will be used once free trial end
      const price = transaction.type === PAYMENT_TYPE.FREE_SUBSCRIPTION ? performer.monthlyPrice : transaction.totalPrice;
      const plan = await stripe.subscriptions.create({
        customer: customer.customerId,
        default_payment_method: cardId,
        items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: 100 * price,
              product: product.planId,
              recurring: {
                interval: 'day',
                interval_count: transaction.type === PAYMENT_TYPE.YEARLY_SUBSCRIPTION ? 365 : 30
              }
            }
          }
        ],
        metadata: {
          transactionId: transaction._id.toString()
        },
        trial_period_days: transaction.type === PAYMENT_TYPE.FREE_SUBSCRIPTION ? performer.durationFreeSubscriptionDays : 0
      });
      return plan;
    } catch (e) {
      throw new HttpException(e?.raw?.message || e?.response || 'Create a subscription plan on Stripe error, please try again later', 400);
    }
  }

  public async deleteSubscriptionPlan(subscription: SubscriptionModel) {
    try {
      const stripe = this.getCredentials();
      const plan = await stripe.subscriptions.retrieve(subscription.subscriptionId);
      plan && await stripe.subscriptions.del(plan.id);
      return true;
    } catch (e) {
      throw new HttpException(e?.raw?.message || e?.response || 'Delete a subscription plan on Stripe error, please try again later', 400);
    }
  }

  public async createSingleCharge(payload: any) {
    try {
      const {
        transaction, item, user, cardId
      } = payload;
      const stripe = this.getCredentials();
      const customer = await this.retrieveCustomer(user);
      const charge = await stripe.paymentIntents.create({
        amount: transaction.totalPrice * 100, // convert cents to dollars
        currency: 'usd',
        customer: customer.customerId,
        payment_method: cardId,
        description: `${user?.name || user?.username} purchase ${transaction.type} ${item.name}`,
        metadata: {
          transactionId: transaction._id.toString() // to track on webhook
        },
        receipt_email: user.email,
        setup_future_usage: 'off_session'
      });
      return charge;
    } catch (e) {
      throw new HttpException(e?.raw?.message || e?.response || 'Charge error, please try again later', 400);
    }
  }
}
