import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule, AgendaModule } from 'src/kernel';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';
import { AuthModule } from '../auth/auth.module';
import {
  feedProviders, pollProviders, voteProviders, scheduledStreamNotificationProviders
} from './providers';
import { FeedFileService, FeedService } from './services';
import {
  AdminFeedController, PerformerFeedController, UserFeedController
} from './controllers';
import {
  ReactionFeedListener, CommentFeedListener, PollFeedListener,
  DeletePerformerFeedListener
} from './listeners';
import { FileModule } from '../file/file.module';
import { PerformerModule } from '../performer/performer.module';
import { ReactionModule } from '../reaction/reaction.module';
import { TokenTransactionModule } from '../token-transaction/token-transaction.module';
import { FollowModule } from '../follow/follow.module';
import { ScheduledFeedAgendaJob, ScheduledStreamNofificationAgendaJob } from './jobs';
import { MailerModule } from '../mailer/mailer.module';
import { UserModule } from '../user/user.module';
import { BlockModule } from '../block/block.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    AgendaModule.register(),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => UserModule),
    forwardRef(() => ReactionModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => TokenTransactionModule),
    forwardRef(() => FollowModule),
    forwardRef(() => MailerModule),
    forwardRef(() => BlockModule),
    forwardRef(() => CommentModule)
  ],
  providers: [
    ...feedProviders,
    ...pollProviders,
    ...voteProviders,
    ...scheduledStreamNotificationProviders,
    FeedService, FeedFileService,
    ReactionFeedListener,
    CommentFeedListener,
    PollFeedListener,
    DeletePerformerFeedListener,
    ScheduledFeedAgendaJob,
    ScheduledStreamNofificationAgendaJob
  ],
  controllers: [
    AdminFeedController,
    PerformerFeedController,
    UserFeedController],
  exports: [
    ...feedProviders,
    FeedService
  ]
})
export class FeedModule { }
