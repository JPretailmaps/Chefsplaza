import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { UserDto } from 'src/modules/user/dtos';
import { CustomerCardService } from '../services';

@Injectable()
@Controller('payment-cards')
export class PaymentCardController {
  constructor(
    private readonly customerCardService: CustomerCardService
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getCards(
    @Query() req: any,
    @CurrentUser() user: UserDto
  ): Promise<DataResponse<any>> {
    const info = await this.customerCardService.findCards(req, user);
    return DataResponse.ok(info);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async deleteCard(
    @CurrentUser() user: UserDto,
    @Param('id') cardId: string
  ): Promise<DataResponse<any>> {
    const info = await this.customerCardService.deleteCard(cardId, user);
    return DataResponse.ok(info);
  }
}
