import { Module, forwardRef } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { QueueModule, AgendaModule } from 'src/kernel';
import { SocketUserService } from './services/socket-user.service';
import { WsUserConnectedGateway } from './gateways/user-connected.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    QueueModule,
    AgendaModule.register(),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        options: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT, 10) || 6379,
          db: parseInt(process.env.REDIS_DB, 10) || 0,
          password: process.env.REDIS_PASSWORD || undefined,
          keyPrefix: process.env.REDIS_PREFIX || undefined
        }
      })
    }),
    forwardRef(() => AuthModule)
  ],
  providers: [
    SocketUserService,
    WsUserConnectedGateway
  ],
  controllers: [
  ],
  exports: [
    SocketUserService
  ]
})
export class SocketModule {}
