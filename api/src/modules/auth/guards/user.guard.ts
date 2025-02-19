import {
  Injectable, CanActivate, ExecutionContext
} from '@nestjs/common';
import { STATUS } from 'src/kernel/constants';
import { AuthService } from '../services';

@Injectable()
export class LoadUser implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization || request.query.Authorization;
    if (!token || token === 'null') return true;

    const decodded = await this.authService.verifySession(token);
    if (!decodded) {
      return false;
    }
    const user = request.user || await this.authService.getSourceFromAuthSession({
      source: decodded.source,
      sourceId: decodded.sourceId
    });
    if (!user || user.status !== STATUS.ACTIVE) {
      return false;
    }
    if (!request.user) request.user = user;
    request.authUser = request.authUser || decodded;
    if (!request.jwToken) request.jwToken = token;
    return true;
  }
}
