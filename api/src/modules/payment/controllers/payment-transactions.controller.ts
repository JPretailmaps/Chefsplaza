import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Query
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser } from 'src/modules/auth';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PaymentSearchService } from '../services';
import { PaymentSearchPayload } from '../payloads/payment-search.payload';
import { IPaymentResponse } from '../dtos';

@Injectable()
@Controller('payment/transactions')
export class PaymentTransactionController {
  constructor(private readonly paymentService: PaymentSearchService) {}

  @Get('/user/search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async userTranasctions(
    @Query() req: PaymentSearchPayload,
    @CurrentUser() user: PerformerDto
  ): Promise<DataResponse<PageableData<IPaymentResponse>>> {
    const data = await this.paymentService.getUserTransactions(req, user);
    return DataResponse.ok(data);
  }
}
