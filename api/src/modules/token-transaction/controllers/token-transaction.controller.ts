import {
  Controller,
  Injectable,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Post,
  Body,
  Param,
  Get,
  Query
} from '@nestjs/common';
import { RoleGuard } from 'src/modules/auth/guards';
import { DataResponse, PageableData } from 'src/kernel';
import { CurrentUser, Roles } from 'src/modules/auth';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { PaymentTokenSearchPayload, PurchaseProductsPayload, SendTipsPayload } from '../payloads';
import { TokenTransactionSearchService, TokenTransactionService } from '../services';
import { TokenTransactionDto } from '../dtos';

@Injectable()
@Controller('wallet/charges')
export class PaymentTokenController {
  constructor(
    private readonly tokenTransactionService: TokenTransactionService,
    private readonly tokenTransactionSearchService: TokenTransactionSearchService
  ) {}

  @Post('/product/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async purchaseProduct(
    @CurrentUser() user: PerformerDto,
    @Param('productId') productId: string,
    @Body() payload: PurchaseProductsPayload
  ): Promise<DataResponse<any>> {
    const info = await this.tokenTransactionService.purchaseProduct(
      productId,
      user,
      payload
    );
    return DataResponse.ok(info);
  }

  @Post('/video/:videoId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async purchaseVideo(
    @CurrentUser() user: PerformerDto,
    @Param('videoId') videoId: string
  ): Promise<DataResponse<any>> {
    const info = await this.tokenTransactionService.purchaseVideo(videoId, user);
    return DataResponse.ok(info);
  }

  @Post('/gallery/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async buyPhoto(
    @CurrentUser() user: PerformerDto,
    @Param('id') galleryId: string
  ): Promise<DataResponse<any>> {
    const info = await this.tokenTransactionService.purchaseGallery(galleryId, user);
    return DataResponse.ok(info);
  }

  @Post('/feed/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async purchasePostFeed(
    @CurrentUser() user: PerformerDto,
    @Param('id') id: string
  ): Promise<DataResponse<any>> {
    const info = await this.tokenTransactionService.purchasePostFeed(id, user);
    return DataResponse.ok(info);
  }

  // @Post('/message/:id')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(RoleGuard)
  // @Roles('user')
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // async purchaseMessage(
  //   @CurrentUser() user: PerformerDto,
  //   @Param('id') id: string
  // ): Promise<DataResponse<any>> {
  //   const info = await this.tokenTransactionService.purchaseMessage(id, user);
  //   return DataResponse.ok(info);
  // }

  @Post('/tip/:performerId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async tip(
    @CurrentUser() user: UserDto,
    @Param('performerId') performerId: string,
    @Body() payload: SendTipsPayload
  ): Promise<DataResponse<any>> {
    const info = await this.tokenTransactionService.sendTips(user, performerId, payload);
    return DataResponse.ok(info);
  }

  // @Post('/send-gift/:giftId')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(RoleGuard)
  // @Roles('user')
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // async sendGift(
  //   @CurrentUser() user: PerformerDto,
  //   @Param('giftId') giftId: string,
  //   @Body() payload: SendGiftPayload
  // ): Promise<DataResponse<any>> {
  //   const info = await this.tokenTransactionService.sendGift(user, giftId, payload);
  //   return DataResponse.ok(info);
  // }

  // @Post('/subscribe/performers')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(RoleGuard)
  // @Roles('user')
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  // async create(
  //   @CurrentUser() user: UserDto,
  //   @Body() payload: SubscribePerformerPayload
  // ): Promise<DataResponse<any>> {
  //   const info = await this.tokenTransactionService.subscribePerformer(payload, user);
  //   return DataResponse.ok(info);
  // }

  @Post('/stream/:streamId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async purchaseStream(
    @CurrentUser() user: UserDto,
    @Param('streamId') streamId: string
  ): Promise<DataResponse<any>> {
    const info = await this.tokenTransactionService.purchaseStream(streamId, user);
    return DataResponse.ok(info);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RoleGuard)
  @Roles('user')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async userTranasctions(
    @Query() req: PaymentTokenSearchPayload,
    @CurrentUser() user: PerformerDto
  ): Promise<DataResponse<PageableData<TokenTransactionDto>>> {
    const data = await this.tokenTransactionSearchService.getUserTransactionsToken(
      req,
      user
    );
    return DataResponse.ok(data);
  }
}
