import {
  Injectable, Inject, forwardRef, BadRequestException, HttpException
} from '@nestjs/common';
import {
  EntityNotFoundException,
  QueueEventService,
  QueueEvent
} from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { Model } from 'mongoose';
import { PerformerService } from 'src/modules/performer/services';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE } from 'src/modules/subscription/constants';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserService } from 'src/modules/user/services';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { PaymentTransactionModel } from '../models';
import { PAYMENT_TRANSACTION_MODEL_PROVIDER } from '../providers';
import {
  PAYMENT_STATUS,
  PAYMENT_TARGET_TYPE,
  PAYMENT_TYPE,
  TRANSACTION_SUCCESS_CHANNEL
} from '../constants';
import { PaymentDto } from '../dtos';

@Injectable()
export class WebhooksPaymentService {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(PAYMENT_TRANSACTION_MODEL_PROVIDER)
    private readonly TransactionModel: Model<PaymentTransactionModel>,
    private readonly queueEventService: QueueEventService,
    private readonly socketUserService: SocketUserService
  ) { }

  public async ccbillSinglePaymentSuccessWebhook(payload: Record<string, any>) {
    const transactionId = payload['X-transactionId'] || payload.transactionId;
    if (!transactionId) {
      throw new BadRequestException();
    }
    if (!isObjectId(transactionId)) {
      return { ok: false };
    }
    const transaction = await this.TransactionModel.findById(
      transactionId
    );
    if (!transaction) {
      return { ok: false };
    }
    transaction.status = PAYMENT_STATUS.SUCCESS;
    transaction.paymentResponseInfo = payload;
    transaction.updatedAt = new Date();
    await transaction.save();
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new PaymentDto(transaction)
      })
    );
    const redirectUrl = `/payment/success?transactionId=${transaction._id.toString().slice(16, 24)}`;
    redirectUrl && await this.socketUserService.emitToUsers(transaction.sourceId, 'payment_status_callback', { redirectUrl });
    return { ok: true };
  }

  public async ccbillRenewalSuccessWebhook(payload: any) {
    const subscriptionId = payload.subscriptionId || payload.subscription_id;
    if (!subscriptionId) {
      throw new BadRequestException();
    }
    const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
    if (!subscription) {
      return { ok: false };
    }
    const transaction = await this.createCCbillRenewalSubscriptionPaymentTransaction(subscription, payload);

    await this.queueEventService.publish(
      new QueueEvent({
        channel: TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new PaymentDto(transaction)
      })
    );
    return { ok: true };
  }

  public async ccbillUserReactivation(payload: any) {
    const { subscriptionId } = payload;
    const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
    if (!subscription) {
      throw new EntityNotFoundException();
    }
    subscription.status = SUBSCRIPTION_STATUS.ACTIVE;
    subscription.updatedAt = new Date();
    await subscription.save();
    await Promise.all([
      this.performerService.updateSubscriptionStat(subscription.performerId, 1),
      this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': 1 })
    ]);
  }

  public async createCCbillRenewalSubscriptionPaymentTransaction(subscription: SubscriptionModel, payload: any) {
    const price = payload.billedAmount || payload.accountingAmount;
    const { userId, performerId, subscriptionType } = subscription;
    const performer = await this.performerService.findById(performerId);
    return this.TransactionModel.create({
      paymentGateway: 'ccbill',
      source: 'user',
      sourceId: userId,
      target: PAYMENT_TARGET_TYPE.PERFORMER,
      targetId: performerId,
      performerId,
      type: subscriptionType === SUBSCRIPTION_TYPE.MONTHLY ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : PAYMENT_TYPE.YEARLY_SUBSCRIPTION,
      originalPrice: price,
      totalPrice: price,
      products: [{
        price,
        quantity: 1,
        name: `${subscriptionType} subscription ${performer?.name || performer?.username}`,
        description: `recurring ${subscriptionType} subscription ${performer?.name || performer?.username}`,
        productId: performerId,
        productType: PAYMENT_TARGET_TYPE.PERFORMER,
        performerId
      }],
      couponInfo: null,
      status: PAYMENT_STATUS.SUCCESS,
      paymentResponseInfo: payload
    });
  }

  private async createRenewalSubscription(transaction: PaymentTransactionModel, totalPrice: number, paymentResponseInfo: any) {
    const {
      paymentGateway, sourceId, targetId, target, type, originalPrice, products, couponInfo
    } = transaction;
    return this.TransactionModel.create({
      paymentGateway,
      source: 'user',
      sourceId,
      target,
      targetId,
      performerId: targetId,
      type: type === PAYMENT_TYPE.FREE_SUBSCRIPTION ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : type,
      originalPrice,
      totalPrice,
      products,
      couponInfo,
      status: PAYMENT_STATUS.SUCCESS,
      paymentResponseInfo
    });
  }

  public async stripeSubscriptionWebhook(payload: Record<string, any>) {
    const { data, type } = payload;
    if (type.includes('customer.subscription.created')) return { success: true };
    const subscriptionId = data?.object?.id;
    const transactionId = data?.object?.metadata?.transactionId;
    if (!subscriptionId && !transactionId) {
      throw new HttpException('Missing subscriptionId or transactionId', 404);
    }
    const subscription = await this.subscriptionService.findBySubscriptionId(subscriptionId);
    if (!subscription) throw new HttpException('Subscription was not found', 404);
    subscription.status = data?.object?.status !== 'active' ? SUBSCRIPTION_STATUS.DEACTIVATED : SUBSCRIPTION_STATUS.ACTIVE;
    subscription.updatedAt = new Date();
    await subscription.save();
    const existedTransaction = transactionId && await this.TransactionModel.findById(transactionId);
    if (existedTransaction) {
      existedTransaction.invoiceId = data?.object?.latest_invoice;
      existedTransaction.updatedAt = new Date();
      await existedTransaction.save();
    }
    return { success: true };
  }

  public async stripePaymentWebhook(payload: Record<string, any>) {
    const { type, data } = payload;
    if (type === 'payment_intent.created') return { ok: true };
    const transactionId = data?.object?.metadata?.transactionId;
    const invoiceId = data?.object?.invoice || data?.object?.id;
    if (!invoiceId && !transactionId) {
      throw new HttpException('Missing invoiceId or transactionId', 404);
    }
    let transaction = transactionId && await this.TransactionModel.findOne({ _id: transactionId });
    if (!transaction) {
      transaction = invoiceId && await this.TransactionModel.findOne({ invoiceId });
    }
    if (!transaction) throw new HttpException('Transaction was not found', 404);

    let redirectUrl = '';
    switch (type) {
      case 'payment_intent.processing':
        transaction.status = PAYMENT_STATUS.PROCESSING;
        break;
      case 'payment_intent.canceled':
        redirectUrl = `/payment/cancel?transactionId=${transaction._id.toString().slice(16, 24)}`;
        transaction.status = PAYMENT_STATUS.CANCELED;
        break;
      case 'payment_intent.payment_failed':
        redirectUrl = `/payment/cancel?transactionId=${transaction._id.toString().slice(16, 24)}`;
        transaction.status = PAYMENT_STATUS.FAIL;
        break;
      case 'payment_intent.requires_action':
        transaction.status = PAYMENT_STATUS.REQUIRE_AUTHENTICATION;
        // redirectUrl = data?.object?.next_action?.use_stripe_sdk?.stripe_js || data?.object?.next_action?.redirect_to_url?.url || '/user/payment-history';
        transaction.stripeClientSecret = data?.object?.client_secret;
        transaction.stripeClientSecret && await this.socketUserService.emitToUsers(transaction.sourceId, 'stripe_confirm_payment', new PaymentDto(transaction));
        break;
      case 'payment_intent.succeeded':
        // create new record for renewal
        if ([PAYMENT_TYPE.FREE_SUBSCRIPTION, PAYMENT_TYPE.MONTHLY_SUBSCRIPTION, PAYMENT_TYPE.YEARLY_SUBSCRIPTION].includes(transaction.type) && transaction.status === PAYMENT_STATUS.SUCCESS) {
          const totalP = Number(data?.object?.amount || 0) / 100 || Number(data?.object?.amount_received || 0) / 100 || transaction.totalPrice;
          const renewalTransaction = await this.createRenewalSubscription(transaction, totalP, payload);
          await this.queueEventService.publish(
            new QueueEvent({
              channel: TRANSACTION_SUCCESS_CHANNEL,
              eventName: EVENT.CREATED,
              data: new PaymentDto(renewalTransaction)
            })
          );
          return { success: true };
        }
        transaction.status = PAYMENT_STATUS.SUCCESS;
        await this.queueEventService.publish(
          new QueueEvent({
            channel: TRANSACTION_SUCCESS_CHANNEL,
            eventName: EVENT.CREATED,
            data: new PaymentDto(transaction)
          })
        );
        redirectUrl = `/payment/success?transactionId=${transaction._id.toString().slice(16, 24)}`;
        break;
      default: break;
    }
    transaction.paymentResponseInfo = payload;
    transaction.updatedAt = new Date();
    await transaction.save();
    redirectUrl && await this.socketUserService.emitToUsers(transaction.sourceId, 'payment_status_callback', { redirectUrl });
    return { success: true };
  }
}
