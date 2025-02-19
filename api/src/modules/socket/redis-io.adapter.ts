import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { getConfig } from 'src/kernel';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    // TODO -
    const pubClient = createClient(getConfig('redis'));
    const subClient = pubClient.duplicate();

    const redisAdapter = createAdapter(pubClient, subClient);

    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);

    Promise.all([pubClient.connect(), subClient.connect()]);
    return server;
  }
}
