import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  UseGuards,
  Request,
  Body,
  Put,
  Query,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { AuthGuard, RoleGuard } from 'src/modules/auth/guards';
import { CurrentUser, Roles } from 'src/modules/auth/decorators';
import { DataResponse, PageableData } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { UserSearchService, UserService } from '../services';
import { UserDto } from '../dtos';
import { UserSearchRequestPayload, UserUpdatePayload } from '../payloads';

@Injectable()
@Controller('users')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userSearchService: UserSearchService
  ) { }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async me(
    @Request() req: any
  ): Promise<DataResponse<UserDto>> {
    const { authUser, jwToken } = req;
    const user = await this.userService.getMe(authUser.sourceId, jwToken);
    return DataResponse.ok(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateMe(
    @CurrentUser() currentUser: UserDto,
    @Body() payload: UserUpdatePayload
  ): Promise<DataResponse<UserDto>> {
    const user = await this.userService.update(currentUser._id, payload, currentUser);
    if (payload.password) {
      // generate auth if have pw, otherwise will create random and send to user email?
      await this.authService.createAuthPassword({
        type: 'password',
        value: payload.password,
        source: 'user',
        key: user.email || user.username,
        sourceId: user._id
      });
    }

    return DataResponse.ok(new UserDto(user).toResponse(true));
  }

  @Get('/search')
  @Roles('performer')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: UserSearchRequestPayload
  ): Promise<DataResponse<PageableData<UserDto>>> {
    return DataResponse.ok(await this.userSearchService.performerSearch(req));
  }
}
