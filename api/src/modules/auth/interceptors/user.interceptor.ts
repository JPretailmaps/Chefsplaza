import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const token = request.headers.authorization || request.headers.Authorization;

    if (token) {
      const decodded = await this.authService.verifySession(
        token
      );
      if (decodded) {
        const user = request.user || (await this.authService.getSourceFromAuthSession({
          source: decodded.source,
          sourceId: decodded.sourceId
        }));
        if (user) request.user = user;
      }
    }
    return next.handle();
  }
}
