import {
  Injectable, CanActivate, ExecutionContext
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WSGuard implements CanActivate {
  constructor() {}

  async canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext
  ): Promise<boolean> {
    throw new WsException('forbiden');
  }
}
