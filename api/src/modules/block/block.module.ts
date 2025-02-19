import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, AgendaModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { blockProviders } from './providers';
import { PerformerBlockService, BlockService } from './services';
import {
  PerformerBlockController, AdminBlockController, BlockController
} from './controllers';
import { UserModule } from '../user/user.module';
import { MailerModule } from '../mailer/mailer.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    MongoDBModule,
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UtilsModule),
    forwardRef(() => MailerModule)
  ],
  providers: [
    ...blockProviders,
    PerformerBlockService,
    BlockService
  ],
  controllers: [
    BlockController,
    PerformerBlockController,
    AdminBlockController
  ],
  exports: [
    ...blockProviders,
    PerformerBlockService,
    BlockService
  ]
})

export class BlockModule {}
