import { MongoDBModule, QueueModule } from 'src/kernel';
import {
  Module, forwardRef, NestModule, MiddlewareConsumer
} from '@nestjs/common';
import { CouponModule } from 'src/modules/coupon/coupon.module';
import { RequestLoggerMiddleware } from 'src/kernel/logger/request-log.middleware';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { paymentProviders } from './providers';
import { SettingModule } from '../settings/setting.module';
import { MailerModule } from '../mailer/mailer.module';
import {
  CCBillService, PaymentService, PaymentSearchService,
  StripeService, CustomerCardService, WebhooksPaymentService
} from './services';
import {
  PaymentController, AdminPaymentTransactionController, PaymentTransactionController,
  CancelSubscriptionController, PaymentWebhookController,
  StripeController, PaymentCardController
} from './controllers';
import { TransactionMailerListener, UpdateUserBalanceListener, SettingsUpdatedListener } from './listeners';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    SocketModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => SettingModule),
    forwardRef(() => CouponModule),
    forwardRef(() => MailerModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...paymentProviders,
    PaymentService,
    CCBillService,
    StripeService,
    PaymentSearchService,
    TransactionMailerListener,
    UpdateUserBalanceListener,
    SettingsUpdatedListener,
    CustomerCardService,
    WebhooksPaymentService
  ],
  controllers: [
    PaymentController,
    AdminPaymentTransactionController,
    PaymentTransactionController,
    StripeController,
    CancelSubscriptionController,
    PaymentWebhookController,
    PaymentCardController
  ],
  exports: [
    ...paymentProviders,
    PaymentService,
    PaymentSearchService
  ]
})

export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes('/payment/*/callhook');
  }
}
