/* eslint-disable no-await-in-loop */
import { QueueEvent, QueueEventService } from 'src/kernel';
import { Injectable, Inject } from '@nestjs/common';
import { EVENT } from 'src/kernel/constants';
// import { PERFORMER_FEED_CHANNEL } from 'src/modules/feed/constants';
// import { FeedDto } from 'src/modules/feed/dtos';
import { Model, Types } from 'mongoose';
import { PERFORMER_MODEL_PROVIDER } from 'src/modules/performer/providers';
import { PerformerModel } from 'src/modules/performer/models';
import {
  PURCHASE_ITEM_STATUS
} from 'src/modules/token-transaction/constants';
import { PAYMENT_TOKEN_MODEL_PROVIDER } from 'src/modules/token-transaction/providers';
import { TokenTransactionModel } from 'src/modules/token-transaction/models';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { USER_MODEL_PROVIDER } from 'src/modules/user/providers';
import { UserModel } from 'src/modules/user/models';
import { ORDER_STATUS, REFUND_ORDER_CHANNEL } from 'src/modules/order/constants';
import { OrderDto } from 'src/modules/order/dtos';
import { ORDER_MODEL_PROVIDER } from 'src/modules/order/providers';
import { OrderModel } from 'src/modules/order/models';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { MailerService } from 'src/modules/mailer';
import { EarningModel } from '../models/earning.model';
import { EARNING_MODEL_PROVIDER } from '../providers/earning.provider';

// const HANDLE_DELETE_FEED_TOPIC = 'HANDLE_DELETE_FEED_TOPIC';
// const HANDLE_DELETE_MESSAGE_TOPIC = 'HANDLE_DELETE_MESSAGE_TOPIC';
const HANDLE_REFUND_ORDER_EARNING_TOPIC = 'HANDLE_REFUND_ORDER_EARNING_TOPIC';

@Injectable()
export class HandleDeleteItemListener {
  constructor(
    @Inject(ORDER_MODEL_PROVIDER)
    private readonly orderModel: Model<OrderModel>,
    @Inject(EARNING_MODEL_PROVIDER)
    private readonly earningModel: Model<EarningModel>,
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly performerModel: Model<PerformerModel>,
    @Inject(USER_MODEL_PROVIDER)
    private readonly userModel: Model<UserModel>,
    @Inject(PAYMENT_TOKEN_MODEL_PROVIDER)
    private readonly tokenTransactionModel: Model<TokenTransactionModel>,
    private readonly queueEventService: QueueEventService,
    private readonly socketUserService: SocketUserService,
    private readonly mailerService: MailerService

  ) {
    this.queueEventService.subscribe(
      REFUND_ORDER_CHANNEL,
      HANDLE_REFUND_ORDER_EARNING_TOPIC,
      this.handleRefundOrder.bind(this)
    );
  }

  private async handleRefundOrder(event: QueueEvent) {
    if (![EVENT.CREATED].includes(event.eventName)) {
      return;
    }
    const { transactionId }: OrderDto = event.data;
    const earning = await this.earningModel.findOne({
      transactionId
    });
    if (!earning) return;
    await Promise.all([
      this.orderModel.updateOne({ transactionId }, { deliveryStatus: ORDER_STATUS.REFUNDED }),
      this.tokenTransactionModel.updateOne({ _id: transactionId }, { status: PURCHASE_ITEM_STATUS.REFUNDED }),
      this.userModel.updateOne({ _id: earning.userId }, { $inc: { balance: earning.grossPrice } }),
      this.performerModel.updateOne({ _id: earning.performerId }, { $inc: { balance: -earning.netPrice } }),
      this.notifyUserBalance(earning),
      this.notifyPerformerBalance(earning.performerId, -earning.netPrice),
      this.earningModel.deleteOne({ _id: earning._id })
    ]);

    const order = await this.orderModel.findOne({ transactionId });
    const adminEmail = SettingService.getValueByKey(SETTING_KEYS.ADMIN_EMAIL);
    order && adminEmail && await this.mailerService.send({
      subject: 'Order Refunded',
      to: adminEmail,
      data: {
        orderNumber: order.orderNumber
      },
      template: 'admin-refund-order'
    });
  }

  private async notifyPerformerBalance(performerId: Types.ObjectId, token: number) {
    this.socketUserService.emitToUsers(performerId, 'update_balance', {
      token
    });
  }

  private async notifyUserBalance(earning: EarningModel) {
    this.socketUserService.emitToUsers(earning.userId, 'update_balance', {
      token: earning.grossPrice
    });
  }
}
