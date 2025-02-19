import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { reportProviders } from './providers';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { DeleteAssetsListener, DeleteUserReactionListener } from './listeners';
import { MailerModule } from '../mailer/mailer.module';
import { SettingModule } from '../settings/setting.module';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [
    QueueModule.forRoot(),
    MongoDBModule,
    forwardRef(() => MailerModule),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => SettingModule),
    forwardRef(() => FeedModule)
  ],
  providers: [
    ...reportProviders,
    DeleteAssetsListener,
    DeleteUserReactionListener,
    ReportService
  ],
  controllers: [ReportController],
  exports: [ReportService]
})
export class ReportModule { }
