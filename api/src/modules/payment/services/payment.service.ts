/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import {
  Injectable, Inject, forwardRef, HttpException, ForbiddenException
} from '@nestjs/common';
import { CouponDto } from 'src/modules/coupon/dtos';
import {
  EntityNotFoundException,
  QueueEventService,
  QueueEvent
} from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { Model, Types } from 'mongoose';

import { CouponService } from 'src/modules/coupon/services';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TYPE } from 'src/modules/subscription/constants';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import axios from 'axios';
import { UserDto } from 'src/modules/user/dtos';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { UserService } from 'src/modules/user/services';
import { SubscriptionModel } from 'src/modules/subscription/models/subscription.model';
import { MailerService } from 'src/modules/mailer';
import { PAYMENT_TRANSACTION_MODEL_PROVIDER } from '../providers';
import { PaymentTransactionModel } from '../models';
import {
  PurchaseTokenPayload, SubscribePerformerPayload
} from '../payloads';
import {
  PAYMENT_STATUS,
  PAYMENT_TYPE,
  PAYMENT_TARGET_TYPE,
  TRANSACTION_SUCCESS_CHANNEL
} from '../constants';
import {
  MissingConfigPaymentException
} from '../exceptions';
import { CCBillService } from './ccbill.service';
import { StripeService } from './stripe.service';
import { PaymentDto } from '../dtos';

const ccbillCancelUrl = 'https://datalink.ccbill.com/utils/subscriptionManagement.cgi';
@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CouponService))
    private readonly couponService: CouponService,
    @Inject(PAYMENT_TRANSACTION_MODEL_PROVIDER)
    private readonly TransactionModel: Model<PaymentTransactionModel>,
    private readonly ccbillService: CCBillService,
    private readonly stripeService: StripeService,
    private readonly queueEventService: QueueEventService,
    private readonly settingService: SettingService,
    private readonly socketUserService: SocketUserService,
    private readonly mailerService: MailerService
  ) { }

  public async findById(id: string | Types.ObjectId) {
    const data = await this.TransactionModel.findById(id);
    return data;
  }

  private async getCCbillPaymentGatewaySettings() {
    const flexformId = SettingService.getValueByKey(SETTING_KEYS.CCBILL_FLEXFORM_ID);
    const singleSubAccountNumber = SettingService.getValueByKey(SETTING_KEYS.CCBILL_SINGLE_SUB_ACCOUNT_NUMBER);
    const recurringSubAccountNumber = SettingService.getValueByKey(SETTING_KEYS.CCBILL_RECURRING_SUB_ACCOUNT_NUMBER);
    const salt = SettingService.getValueByKey(SETTING_KEYS.CCBILL_SALT);
    if (!flexformId || !singleSubAccountNumber || !recurringSubAccountNumber || !salt) {
      throw new MissingConfigPaymentException();
    }
    return {
      flexformId,
      singleSubAccountNumber,
      recurringSubAccountNumber,
      salt
    };
  }

  public async createSubscriptionPaymentTransaction(performer: PerformerDto, subscriptionType: string, user: UserDto, paymentGateway = 'stripe', couponInfo = null) {
    const price = () => {
      switch (subscriptionType) {
        case PAYMENT_TYPE.FREE_SUBSCRIPTION: return 0;
        case PAYMENT_TYPE.MONTHLY_SUBSCRIPTION: return performer.monthlyPrice;
        case PAYMENT_TYPE.YEARLY_SUBSCRIPTION: return performer.yearlyPrice;
        default: return performer.monthlyPrice;
      }
    };
    const totalPrice = couponInfo ? price() - parseFloat((price() * couponInfo.value).toFixed(2)) : price();
    return this.TransactionModel.create({
      paymentGateway,
      source: 'user',
      sourceId: user._id,
      target: PAYMENT_TARGET_TYPE.PERFORMER,
      targetId: performer._id,
      performerId: performer._id,
      type: subscriptionType,
      originalPrice: price(),
      totalPrice,
      products: [
        {
          price: totalPrice,
          quantity: 1,
          name: `${subscriptionType} ${performer?.name || performer?.username}`,
          description: `${subscriptionType} ${performer?.name || performer?.username} ${subscriptionType === PAYMENT_TYPE.FREE_SUBSCRIPTION ? `in ${performer?.durationFreeSubscriptionDays} days` : ''}`,
          productId: performer._id,
          productType: PAYMENT_TARGET_TYPE.PERFORMER,
          performerId: performer._id
        }
      ],
      couponInfo,
      status: PAYMENT_STATUS.CREATED,
      paymentResponseInfo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public async subscribePerformer(payload: SubscribePerformerPayload, user: UserDto) {
    const {
      type, performerId, cardId
    } = payload;
    const paymentGateway = SettingService.getValueByKey(SETTING_KEYS.PAYMENT_GATEWAY) || 'stripe';
    const performer = await this.performerService.findById(performerId);
    if (!performer) throw new EntityNotFoundException();
    if (type === SUBSCRIPTION_TYPE.FREE) {
      const subscription = await this.subscriptionService.findOneSubscription({
        userId: user._id,
        performerId
      });
      if (subscription && subscription.usedFreeSubscription) {
        throw new HttpException('You\'ve subscribed for free already!', 422);
      }
    }
    // eslint-disable-next-line no-nested-ternary
    const subscriptionType = type === SUBSCRIPTION_TYPE.FREE ? PAYMENT_TYPE.FREE_SUBSCRIPTION : type === SUBSCRIPTION_TYPE.MONTHLY ? PAYMENT_TYPE.MONTHLY_SUBSCRIPTION : PAYMENT_TYPE.YEARLY_SUBSCRIPTION;
    const transaction = await this.createSubscriptionPaymentTransaction(performer, subscriptionType, user, paymentGateway);
    if (paymentGateway === 'ccbill') {
      if (transaction.type === PAYMENT_TYPE.FREE_SUBSCRIPTION) {
        transaction.status = PAYMENT_STATUS.SUCCESS;
        await transaction.save();
        await this.queueEventService.publish(
          new QueueEvent({
            channel: TRANSACTION_SUCCESS_CHANNEL,
            eventName: EVENT.CREATED,
            data: new PaymentDto(transaction)
          })
        );
        await this.socketUserService.emitToUsers(
          transaction.sourceId,
          'payment_status_callback',
          { redirectUrl: `/payment/success?transactionId=${transaction._id.toString().slice(16, 24)}` }
        );
        return new PaymentDto(transaction).toResponse();
      }
      const { flexformId, recurringSubAccountNumber, salt } = await this.getCCbillPaymentGatewaySettings();
      return this.ccbillService.subscription({
        transactionId: transaction._id,
        price: transaction.totalPrice,
        flexformId,
        salt,
        recurringSubAccountNumber,
        subscriptionType
      });
    }
    if (paymentGateway === 'stripe') {
      if (!cardId) {
        throw new HttpException('Please add a payment card', 422);
      }
      const plan = await this.stripeService.createSubscriptionPlan(transaction, performer, user, cardId);
      if (plan) {
        transaction.status = transaction.type === PAYMENT_TYPE.FREE_SUBSCRIPTION ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.CREATED;
        transaction.paymentResponseInfo = plan;
        transaction.invoiceId = plan.latest_invoice as any;
        await this.subscriptionService.updateSubscriptionId(new PaymentDto(transaction), plan.id);
      }
      if (transaction.type === PAYMENT_TYPE.FREE_SUBSCRIPTION) {
        transaction.status = PAYMENT_STATUS.SUCCESS;
        await this.queueEventService.publish(
          new QueueEvent({
            channel: TRANSACTION_SUCCESS_CHANNEL,
            eventName: EVENT.CREATED,
            data: new PaymentDto(transaction)
          })
        );
        await this.socketUserService.emitToUsers(
          transaction.sourceId,
          'payment_status_callback',
          { redirectUrl: `/payment/success?transactionId=${transaction._id.toString().slice(16, 24)}` }
        );
      }

      await transaction.save();
      return new PaymentDto(transaction).toResponse();
    }
    return new PaymentDto(transaction).toResponse();
  }

  public async createTokenPaymentTransaction(
    products: any[],
    paymentGateway: string,
    totalPrice: number,
    user: UserDto,
    couponInfo?: CouponDto
  ) {
    const paymentTransaction = new this.TransactionModel();
    paymentTransaction.originalPrice = totalPrice;
    paymentTransaction.paymentGateway = paymentGateway || 'stripe';
    paymentTransaction.source = 'user';
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = PAYMENT_TARGET_TYPE.TOKEN_PACKAGE;
    paymentTransaction.targetId = products[0].productId;
    paymentTransaction.performerId = null;
    paymentTransaction.type = PAYMENT_TYPE.TOKEN_PACKAGE;
    paymentTransaction.totalPrice = couponInfo ? totalPrice - parseFloat((totalPrice * couponInfo.value).toFixed(2)) : totalPrice;
    paymentTransaction.products = products;
    paymentTransaction.paymentResponseInfo = null;
    paymentTransaction.status = PAYMENT_STATUS.CREATED;
    paymentTransaction.couponInfo = couponInfo;
    paymentTransaction.createdAt = new Date();
    paymentTransaction.updatedAt = new Date();
    await paymentTransaction.save();
    return paymentTransaction;
  }

  public async buyTokens(payload: PurchaseTokenPayload, user: UserDto) {
    const {
      couponCode, amount, cardId
    } = payload;
    const paymentGateway = SettingService.getValueByKey(SETTING_KEYS.PAYMENT_GATEWAY) || 'stripe';
    const totalPrice = amount;
    const minWalletPrice = SettingService.getValueByKey(SETTING_KEYS.MINIMUM_WALLET_PRICE) || 10;
    const maxWalletPrice = SettingService.getValueByKey(SETTING_KEYS.MAXIMUM_WALLET_PRICE) || 1000;
    if (totalPrice < minWalletPrice) {
      throw new HttpException(`Minimum top up amount is $${minWalletPrice}`, 422);
    }
    if (totalPrice > maxWalletPrice) {
      throw new HttpException(`Maximum top up amount is $${maxWalletPrice}`, 422);
    }
    const products = [{
      price: totalPrice,
      quantity: 1,
      name: 'Wallet',
      description: `Top up Wallet $${amount}`,
      productId: null,
      productType: PAYMENT_TARGET_TYPE.TOKEN_PACKAGE,
      performerId: null,
      tokens: amount
    }];

    let coupon = null;
    if (couponCode) {
      coupon = await this.couponService.applyCoupon(couponCode, user._id);
    }

    const transaction = await this.createTokenPaymentTransaction(
      products,
      paymentGateway,
      totalPrice,
      user,
      coupon
    );

    if (paymentGateway === 'ccbill') {
      const { flexformId, singleSubAccountNumber, salt } = await this.getCCbillPaymentGatewaySettings();
      return this.ccbillService.singlePurchase({
        salt,
        flexformId,
        singleSubAccountNumber,
        price: coupon ? totalPrice - (totalPrice * coupon.value) : totalPrice,
        transactionId: transaction._id
      });
    }
    if (paymentGateway === 'stripe') {
      if (!cardId) {
        throw new HttpException('Please add a payment card', 422);
      }
      const data = await this.stripeService.createSingleCharge({
        transaction,
        item: {
          name: `Wallet - Top up $${amount}`
        },
        user,
        cardId
      });
      transaction.invoiceId = data.id || (data.invoice && data.invoice.toString());
      transaction.stripeClientSecret = data.client_secret;
      await transaction.save();
      return new PaymentDto(transaction).toResponse();
    }
    throw new MissingConfigPaymentException();
  }

  public async ccbillCancelSubscription(id: any, user: UserDto) {
    const subscription = await this.subscriptionService.findById(id);
    if (!subscription) {
      throw new EntityNotFoundException();
    }
    if (!user.roles.includes('admin') && `${subscription.userId}` !== `${user._id}`) {
      throw new ForbiddenException();
    }
    if (!subscription.subscriptionId) {
      subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
      await subscription.save();
      await Promise.all([
        this.performerService.updateSubscriptionStat(subscription.performerId, -1),
        this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': -1 })
      ]);
      await this.cancelSubscriptionMailer(subscription);
      return { success: true };
    }
    const { subscriptionId } = subscription;
    const [ccbillClientAccNo, ccbillDatalinkUsername, ccbillDatalinkPassword] = await Promise.all([
      this.settingService.getKeyValue(SETTING_KEYS.CCBILL_CLIENT_ACCOUNT_NUMBER),
      this.settingService.getKeyValue(SETTING_KEYS.CCBILL_DATALINK_USERNAME),
      this.settingService.getKeyValue(SETTING_KEYS.CCBILL_DATALINK_PASSWORD)
    ]);
    if (!ccbillClientAccNo || !ccbillDatalinkUsername || !ccbillDatalinkPassword) {
      throw new MissingConfigPaymentException();
    }
    const resp = await axios.get(`${ccbillCancelUrl}?&subscriptionId=${subscriptionId}&username=${ccbillDatalinkUsername}&password=${ccbillDatalinkPassword}&action=cancelSubscription&clientAccnum=${ccbillClientAccNo}`);
    // TODO tracking data response
    if (resp?.data && resp?.data.includes('"results"\n"1"\n')) {
      subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
      subscription.updatedAt = new Date();
      await subscription.save();
      await Promise.all([
        this.performerService.updateSubscriptionStat(subscription.performerId, -1),
        this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': -1 })
      ]);
      return { success: true };
    }
    if (resp?.data && resp?.data.includes('"results"\n"0"\n')) {
      throw new HttpException('The requested action failed.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-1"\n')) {
      throw new HttpException('The arguments provided to authenticate the merchant were invalid or missing.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-2"\n')) {
      throw new HttpException('The subscription id provided was invalid or the subscription type is not supported by the requested action.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-3"\n')) {
      throw new HttpException('No record was found for the given subscription.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-4"\n')) {
      throw new HttpException('The given subscription was not for the account the merchant was authenticated on.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-5"\n')) {
      throw new HttpException('The arguments provided for the requested action were invalid or missing.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-6"\n')) {
      throw new HttpException('The requested action was invalid', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-7"\n')) {
      throw new HttpException('There was an internal error or a database error and the requested action could not complete.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-8"\n')) {
      throw new HttpException('The IP Address the merchant was attempting to authenticate on was not in the valid range.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-9"\n')) {
      throw new HttpException('The merchant’s account has been deactivated for use on the Datalink system or the merchant is not permitted to perform the requested action', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-10"\n')) {
      throw new HttpException('The merchant has not been set up to use the Datalink system.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-11"\n')) {
      throw new HttpException('Subscription is not eligible for a discount, recurring price less than $5.00.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-12"\n')) {
      throw new HttpException('The merchant has unsuccessfully logged into the system 3 or more times in the last hour. The merchant should wait an hour before attempting to login again and is advised to review the login information.', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-15"\n')) {
      throw new HttpException('Merchant over refund threshold', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-16"\n')) {
      throw new HttpException('Merchant over void threshold', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-23"\n')) {
      throw new HttpException('Transaction limit reached', 400);
    }
    if (resp?.data && resp?.data.includes('"results"\n"-24"\n')) {
      throw new HttpException('Purchase limit reached', 400);
    }

    await this.cancelSubscriptionMailer(subscription);
    throw new HttpException('Cancel subscription has been fail, please try again later', 400);
  }

  public async stripeCancelSubscription(id: any, user: UserDto) {
    const subscription = await this.subscriptionService.findById(id);
    if (!subscription) {
      throw new EntityNotFoundException();
    }
    if (!user.roles.includes('admin') && `${subscription.userId}` !== `${user._id}`) {
      throw new ForbiddenException();
    }
    if (!subscription.subscriptionId) {
      subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
      await subscription.save();
      await Promise.all([
        this.performerService.updateSubscriptionStat(subscription.performerId, -1),
        this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': -1 })
      ]);
      await this.cancelSubscriptionMailer(subscription);
      return { success: true };
    }
    await this.stripeService.deleteSubscriptionPlan(subscription);
    subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
    subscription.updatedAt = new Date();
    await subscription.save();
    await Promise.all([
      this.performerService.updateSubscriptionStat(subscription.performerId, -1),
      this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': -1 })
    ]);
    await this.cancelSubscriptionMailer(subscription);
    return { success: true };
  }

  public async systemCancelSubscription(id: any, user: UserDto) {
    const subscription = await this.subscriptionService.findById(id);
    if (!subscription) {
      throw new EntityNotFoundException();
    }
    if (!user.roles.includes('admin') && `${subscription.userId}` !== `${user._id}`) {
      throw new ForbiddenException();
    }
    subscription.status = SUBSCRIPTION_STATUS.DEACTIVATED;
    subscription.updatedAt = new Date();
    await subscription.save();
    await Promise.all([
      this.performerService.updateSubscriptionStat(subscription.performerId, -1),
      this.userService.updateStats(subscription.userId, { 'stats.totalSubscriptions': -1 })
    ]);
    return { success: true };
  }

  private async cancelSubscriptionMailer(subscription: SubscriptionModel) {
    if (subscription.status !== SUBSCRIPTION_STATUS.DEACTIVATED) return;
    const [user, performer, adminEmail] = await Promise.all([
      this.userService.findById(subscription.userId),
      this.performerService.findById(subscription.performerId),
      SettingService.getValueByKey(SETTING_KEYS.ADMIN_EMAIL)
    ]);

    adminEmail && await this.mailerService.send({
      subject: 'Subscription Canceled',
      to: adminEmail,
      data: {
        userName: user?.name || user?.username,
        subscriptionId: subscription.subscriptionId || subscription._id
      },
      template: 'admin-cancel-subscription'
    });
    performer?.email && await this.mailerService.send({
      subject: 'Subscription Canceled',
      to: performer?.email,
      data: {
        userName: user?.name || user?.username,
        subscriptionId: subscription.subscriptionId || subscription._id
      },
      template: 'performer-cancel-subscription'
    });
  }
}
