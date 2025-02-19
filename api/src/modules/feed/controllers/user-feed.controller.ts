import {
  Controller,
  Injectable,
  UseGuards,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
  Query,
  Request,
  Inject,
  forwardRef
} from '@nestjs/common';
import { AuthGuard, LoadUser } from 'src/modules/auth/guards';
import { DataResponse, ForbiddenException } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth';
import { AuthService } from 'src/modules/auth/services';
import { UserDto } from 'src/modules/user/dtos';
import { FeedService } from '../services';
import { FeedSearchRequest } from '../payloads';

@Injectable()
@Controller('user/feeds')
export class UserFeedController {
  constructor(
    private readonly feedService: FeedService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  @Get('/')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getPerformerFeeds(
    @Query() query: FeedSearchRequest,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.userSearchFeeds(query, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Get('/:id')
  @UseGuards(LoadUser)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async details(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Request() req: any
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.findOne(id, user, req.jwToken);
    return DataResponse.ok(data);
  }

  @Get('/auth/check')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkAuth(
    @Request() req: any
  ) {
    if (!req.query.token) throw new ForbiddenException();
    const auth = await this.authService.verifySession(req.query.token);
    if (!auth) throw new ForbiddenException();
    const user = await this.authService.getSourceFromAuthSession({ source: auth.source, sourceId: auth.sourceId });
    if (!user) {
      throw new ForbiddenException();
    }
    const valid = await this.feedService.checkAuth(req, user);
    return DataResponse.ok(valid);
  }

  @Post('/vote/:pollId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(
    @Param('pollId') pollId: string,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const data = await this.feedService.votePollFeed(pollId, user);
    return DataResponse.ok(data);
  }
}
