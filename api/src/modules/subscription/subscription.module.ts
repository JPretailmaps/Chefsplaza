import { Module, forwardRef } from '@nestjs/common';
import { AgendaModule, MongoDBModule, QueueModule } from 'src/kernel';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionService } from './services/subscription.service';
import { subscriptionProviders } from './providers/subscription.provider';
import { TransactionSubscriptionListener } from './listeners/transaction-update.listener';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { MailerModule } from '../mailer/mailer.module';
import { CountSubscriptionStatsJob } from './jobs/count-subscription-stats.job';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...subscriptionProviders,
    SubscriptionService,
    TransactionSubscriptionListener,
    CountSubscriptionStatsJob
  ],
  controllers: [SubscriptionController],
  exports: [
    ...subscriptionProviders,
    SubscriptionService
  ]
})
export class SubscriptionModule { }
