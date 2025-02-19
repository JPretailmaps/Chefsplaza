import { Injectable } from '@nestjs/common';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { TOKEN_TRANSACTION_SUCCESS_CHANNEL, PURCHASE_ITEM_TYPE } from 'src/modules/token-transaction/constants';
import { EVENT } from 'src/kernel/constants';
import { REFUND_ORDER_CHANNEL } from 'src/modules/order/constants';
import { OrderDto } from 'src/modules/order/dtos';
import { TokenTransactionDto } from 'src/modules/token-transaction/dtos';
import { ProductService } from '../services';
import { PRODUCT_TYPE } from '../constants';

const UPDATE_STOCK_TOPIC = 'UPDATE_STOCK_TOPIC';

@Injectable()
export class StockProductListener {
  constructor(
    private readonly queueEventService: QueueEventService,
    private readonly productService: ProductService
  ) {
    this.queueEventService.subscribe(
      TOKEN_TRANSACTION_SUCCESS_CHANNEL,
      UPDATE_STOCK_TOPIC,
      this.handleStockProducts.bind(this)
    );
    this.queueEventService.subscribe(
      REFUND_ORDER_CHANNEL,
      UPDATE_STOCK_TOPIC,
      this.handleRefundedOrder.bind(this)
    );
  }

  private async handleRefundedOrder(event: QueueEvent) {
    if (![EVENT.CREATED].includes(event.eventName)) {
      return;
    }
    const { productId, quantity }: OrderDto = event.data;
    const product = await this.productService.findById(productId);
    if (!product || product.type !== 'physical') {
      await this.productService.updateStock(product._id, quantity);
    }
  }

  private async handleStockProducts(event: QueueEvent) {
    if (![EVENT.CREATED].includes(event.eventName)) {
      return;
    }
    const transaction = event.data as TokenTransactionDto;
    if (transaction.type !== PURCHASE_ITEM_TYPE.PRODUCT || !transaction.products || !transaction.products.length) {
      return;
    }
    const product = await this.productService.findById(transaction.targetId);
    if (!product || (product.type !== PRODUCT_TYPE.PHYSICAL)) return;
    await this.productService.updateStock(product._id, -(transaction.products[0].quantity || 1));
  }
}
