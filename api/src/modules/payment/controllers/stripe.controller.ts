import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Body,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { StripeService } from '../services';
import { AuthoriseCardPayload } from '../payloads/authorise-card.payload';

@Injectable()
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService
  ) {}

  @Post('/cards')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async authoriseCard(
    @CurrentUser() user: UserDto,
    @Body() payload: AuthoriseCardPayload
  ): Promise<DataResponse<any>> {
    const info = await this.stripeService.authoriseCard(user, payload);
    return DataResponse.ok(info);
  }
}
