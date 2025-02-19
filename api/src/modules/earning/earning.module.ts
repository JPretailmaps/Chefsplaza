import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule } from 'src/kernel';
import { TokenTransactionModule } from 'src/modules/token-transaction/token-transaction.module';
import { SocketModule } from '../socket/socket.module';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { PaymentModule } from '../payment/payment.module';
import { SettingModule } from '../settings/setting.module';
import { PerformerEarningController } from './controllers/performer-earning.controller';
import { AdminEarningController } from './controllers/admin-earning.controller';
import { EarningService } from './services/earning.service';
import { earningProviders } from './providers/earning.provider';
import { TransactionEarningListener, HandleDeleteItemListener } from './listeners';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    MongoDBModule,
    SocketModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => SettingModule),
    forwardRef(() => TokenTransactionModule),
    forwardRef(() => OrderModule),
    forwardRef(() => MailerModule)
  ],
  providers: [...earningProviders, EarningService, TransactionEarningListener, HandleDeleteItemListener],
  controllers: [PerformerEarningController, AdminEarningController],
  exports: [...earningProviders, EarningService]
})
export class EarningModule {}
