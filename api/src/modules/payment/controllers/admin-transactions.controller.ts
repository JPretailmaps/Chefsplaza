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
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData } from 'src/kernel';
import { Roles } from 'src/modules/auth';
import { PaymentSearchService } from '../services';
import { PaymentSearchPayload } from '../payloads/payment-search.payload';
import { IPaymentResponse } from '../dtos';

@Injectable()
@Controller('payment/transactions')
export class AdminPaymentTransactionController {
  constructor(private readonly paymentService: PaymentSearchService) {}

  @Get('/admin/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminTranasctions(
    @Query() req: PaymentSearchPayload
  ): Promise<DataResponse<PageableData<IPaymentResponse>>> {
    const data = await this.paymentService.adminGetUserTransactions(req);
    return DataResponse.ok(data);
  }
}
