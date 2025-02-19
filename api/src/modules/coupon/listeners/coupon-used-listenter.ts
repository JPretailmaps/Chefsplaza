import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { TRANSACTION_SUCCESS_CHANNEL, PAYMENT_STATUS, PAYMENT_TYPE } from 'src/modules/payment/constants';
import { EVENT } from 'src/kernel/constants';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { CouponService } from '../services/coupon.service';

const UPDATE_COUPON_USED_TOPIC = 'UPDATE_COUPON_USED_TOPIC';

@Injectable()
export class UpdateCouponUsesListener {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly queueEventService: QueueEventService,
    private readonly couponService: CouponService,
    private readonly mailerService: MailerService
  ) {
    this.queueEventService.subscribe(
      TRANSACTION_SUCCESS_CHANNEL,
      UPDATE_COUPON_USED_TOPIC,
      this.handleUpdateCoupon.bind(this)
    );
  }

  public async handleUpdateCoupon(event: QueueEvent) {
    if (![EVENT.CREATED].includes(event.eventName)) {
      return;
    }
    const transaction = event.data;
    // TOTO handle more event transaction
    if (transaction.status !== PAYMENT_STATUS.SUCCESS) {
      return;
    }
    if (!transaction.couponInfo || !transaction.couponInfo._id) {
      return;
    }
    await this.couponService.updateNumberOfUses(transaction.couponInfo._id);
    if (transaction.type === PAYMENT_TYPE.TOKEN_PACKAGE) {
      const adminEmail = SettingService.getValueByKey(SETTING_KEYS.ADMIN_EMAIL);
      const user = await this.userService.findById(transaction.sourceId);
      user && adminEmail && await this.mailerService.send({
        subject: 'Coupon Used',
        to: adminEmail,
        data: {
          userName: user?.name || user?.username,
          transactionId: (transaction._id.toString()).slice(16, 24)
        },
        template: 'admin-coupon-used'
      });
    }
  }
}
