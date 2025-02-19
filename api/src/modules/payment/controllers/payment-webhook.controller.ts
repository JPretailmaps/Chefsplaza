import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
  Query,
  ForbiddenException
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { IpAddress } from 'src/modules/utils/decorators';
import { isValidCCBillIP } from 'src/modules/utils/services/utils.service';
import { WebhooksPaymentService } from '../services/webhooks.service';

@Injectable()
@Controller('payment')
export class PaymentWebhookController {
  constructor(
    private readonly webhooksPaymentService: WebhooksPaymentService
  ) { }

  @Post('/ccbill/callhook')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async ccbillCallhook(
    @Body() payload: Record<string, string>,
    @Query() req: Record<string, string>,
    @IpAddress() ipAddress: string
  ): Promise<DataResponse<any>> {
    // check whitelist IP of ccbill in production env
    if (process.env.NODE_ENV === 'production' && !isValidCCBillIP(ipAddress)) {
      throw new ForbiddenException('Invalid request IP!');
    }

    // TODO - update for ccbill whitelist here
    if (!['NewSaleSuccess', 'RenewalSuccess', 'UserReactivation'].includes(req.eventType)) {
      return DataResponse.ok(false);
    }

    let info;
    const data = {
      ...payload,
      ...req
    };
    switch (req.eventType) {
      case 'UserReactivation':
        info = await this.webhooksPaymentService.ccbillUserReactivation(data);
        break;
      case 'RenewalSuccess':
        info = await this.webhooksPaymentService.ccbillRenewalSuccessWebhook(data);
        break;
      default:
        info = await this.webhooksPaymentService.ccbillSinglePaymentSuccessWebhook(
          data
        );
        break;
    }
    return DataResponse.ok(info);
  }

  @Post('/stripe/callhook')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async stripePaymentCallhook(
    @Body() payload: Record<string, string>
  ): Promise<DataResponse<any>> {
    const { type } = payload; // event type
    if (!type.includes('payment_intent') && !type.includes('customer.subscription')) {
      return DataResponse.ok(false);
    }
    let info;
    if (type.includes('customer.subscription')) {
      info = await this.webhooksPaymentService.stripeSubscriptionWebhook(payload);
    }
    if (type.includes('payment_intent')) {
      info = await this.webhooksPaymentService.stripePaymentWebhook(payload);
    }
    return DataResponse.ok(info);
  }
}
