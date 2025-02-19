import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Injectable,
  UseGuards,
  Body,
  Put,
  Query,
  ValidationPipe,
  UsePipes,
  Param,
  Post,
  Inject,
  forwardRef,
  Delete
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { Roles } from 'src/modules/auth/decorators';
import { PageableData } from 'src/kernel/common';
import { DataResponse } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import {
  UserSearchRequestPayload,
  UserCreatePayload,
  AdminUpdatePayload
} from '../payloads';

import { UserDto } from '../dtos';
import { UserService, UserSearchService } from '../services';

@Injectable()
@Controller('admin/users')
export class AdminUserController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly userSearchService: UserSearchService

  ) {}

  @Get('/search')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async search(
    @Query() req: UserSearchRequestPayload
  ): Promise<DataResponse<PageableData<UserDto>>> {
    return DataResponse.ok(await this.userSearchService.search(req));
  }

  @Post('/')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createUser(
    @Body() payload: UserCreatePayload
  ): Promise<DataResponse<UserDto>> {
    const user = await this.userService.create(payload);

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

  @Put('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUser(
    @Body() payload: AdminUpdatePayload,
    @Param('id') userId: string
  ): Promise<DataResponse<any>> {
    const data = await this.userService.adminUpdate(userId, payload);
    return DataResponse.ok(new UserDto(data).toResponse(true));
  }

  @Get('/:id/view')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getDetails(
    @Param('id') id: string
  ): Promise<DataResponse<UserDto>> {
    const user = await this.userService.findById(id);
    // TODO - check roles or other to response info
    return DataResponse.ok(new UserDto(user).toResponse(true));
  }

  @Delete('/:id/delete')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async delete(
    @Param('id') id: string
  ): Promise<DataResponse<any>> {
    const data = await this.userService.delete(id);
    return DataResponse.ok(data);
  }
}
