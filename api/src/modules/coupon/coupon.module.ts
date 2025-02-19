import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { AuthModule } from '../auth/auth.module';
import { couponProviders } from './providers';
import { CouponService, CouponSearchService } from './services';
import { AdminCouponController, CouponController } from './controllers';
import { UpdateCouponUsesListener } from './listeners/coupon-used-listenter';
import { PerformerModule } from '../performer/performer.module';
import { SettingModule } from '../settings/setting.module';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongoDBModule,
    forwardRef(() => PerformerModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => MailerModule),
    forwardRef(() => SettingModule)
  ],
  providers: [...couponProviders, CouponService, CouponSearchService, UpdateCouponUsesListener],
  controllers: [AdminCouponController, CouponController],
  exports: [CouponService, CouponSearchService]
})
export class CouponModule {}
