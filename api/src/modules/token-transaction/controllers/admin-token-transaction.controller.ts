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
import { TokenTransactionSearchService } from '../services';
import { PaymentTokenSearchPayload } from '../payloads/purchase-item.search.payload';
import { TokenTransactionDto } from '../dtos';

@Injectable()
@Controller('admin/wallet/charges')
export class AdminPaymentTokenController {
  constructor(
    private readonly tokenTransactionSearchService: TokenTransactionSearchService
  ) {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async adminTranasctions(
    @Query() req: PaymentTokenSearchPayload
  ): Promise<DataResponse<PageableData<TokenTransactionDto>>> {
    const data = await this.tokenTransactionSearchService.adminGetUserTransactionsToken(
      req
    );
    return DataResponse.ok(data);
  }
}
