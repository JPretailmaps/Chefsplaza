import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import {
  TOKEN_TRANSACTION_SUCCESS_CHANNEL, PURCHASE_ITEM_TYPE,
  PURCHASE_ITEM_STATUS
} from 'src/modules/token-transaction/constants';
import { EVENT } from 'src/kernel/constants';
import { ProductService } from 'src/modules/performer-assets/services';
import { PRODUCT_TYPE } from 'src/modules/performer-assets/constants';
import { MailerService } from 'src/modules/mailer';
import { UserService } from 'src/modules/user/services';
import { PerformerService } from 'src/modules/performer/services';
import { TokenTransactionDto } from 'src/modules/token-transaction/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { AuthService } from 'src/modules/auth/services';
import { UserModel } from 'src/modules/user/models';
import { FileService } from 'src/modules/file/services';
import { FileDto } from 'src/modules/file';
import { ProductModel } from 'src/modules/performer-assets/models';
import { ORDER_STATUS } from '../constants';
import { OrderModel, ShippingAddressModel } from '../models';
import { ORDER_MODEL_PROVIDER, SHIPPING_ADDRESS_MODEL_PROVIDER } from '../providers';
import { OrderDto } from '../dtos';

const ORDER_TOPIC = 'ORDER_TOPIC';

@Injectable()
export class OrderListener {
  constructor(
    private readonly productService: ProductService,
    @Inject(forwardRef(() => ProductService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(ORDER_MODEL_PROVIDER)
    private readonly orderModel: Model<OrderModel>,
    @Inject(SHIPPING_ADDRESS_MODEL_PROVIDER)
    private readonly shippingAddressModel: Model<ShippingAddressModel>,
    private readonly queueEventService: QueueEventService,
    private readonly mailService: MailerService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {
    this.queueEventService.subscribe(
      TOKEN_TRANSACTION_SUCCESS_CHANNEL,
      ORDER_TOPIC,
      this.handleListen.bind(this)
    );
  }

  public async handleListen(
    event: QueueEvent
  ): Promise<OrderDto> {
    if (event.eventName !== EVENT.CREATED) {
      return;
    }
    const transaction = event.data as any;
    if (!transaction || transaction.status !== PURCHASE_ITEM_STATUS.SUCCESS || (transaction?.type !== PURCHASE_ITEM_TYPE.PRODUCT)) {
      return;
    }
    const {
      shippingInfo, performerId, sourceId, totalPrice, products
    } = transaction as TokenTransactionDto;
    const [performer, user, product] = await Promise.all([
      this.performerService.findById(performerId),
      this.userService.findById(sourceId),
      this.productService.findById(transaction.targetId)
    ]);
    // because single purchase
    const _product = products[0];
    const address = shippingInfo?.deliveryAddressId && await this.shippingAddressModel.findById(shippingInfo?.deliveryAddressId);
    const deliveryAddress = address ? `${(address?.name || '').toUpperCase()} - ${address?.streetNumber} ${address?.streetAddress || ''}, ${address?.ward || ''}, ${address?.district || ''}, ${address?.city || ''}, ${address?.state || ''} ${address?.zipCode || ''}, ${address?.country || ''}` : '';
    const order = await this.orderModel.create({
      transactionId: transaction._id,
      performerId: transaction.performerId,
      userId: transaction.sourceId,
      orderNumber: transaction._id.toString().slice(16, 24).toUpperCase(),
      shippingCode: '',
      productId: _product.productId,
      unitPrice: _product.price,
      quantity: _product.quantity || 0,
      totalPrice,
      deliveryAddressId: shippingInfo?.deliveryAddressId || null,
      deliveryAddress,
      deliveryStatus: product.type === PRODUCT_TYPE.DIGITAL ? ORDER_STATUS.DELIVERED : ORDER_STATUS.PROCESSING,
      phoneNumber: shippingInfo?.phoneNumber,
      userNote: shippingInfo?.userNote,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    if (product.type === PRODUCT_TYPE.DIGITAL) {
      await this.sendDigitalProductLink(product, order, user, performer);
    } else {
      await this.sendPhysicalProduct(product, order, user, performer);
    }
  }

  private async sendDigitalProductLink(product: ProductModel, order: OrderModel, user: UserModel, performer: PerformerDto) {
    if (!user.email) return;
    const auth = await this.authService.findBySource({ source: 'user', sourceId: user._id });
    const token = auth && await this.authService.updateAuthSession('user', auth.sourceId);
    const file = await this.fileService.findById(product.digitalFileId);
    if (file) {
      const digitalLink = token ? `${new FileDto(file).getUrl()}?productId=${product._id}&token=${token}` : new FileDto(file).getUrl();
      user?.email && await this.mailService.send({
        subject: 'Digital file',
        to: user.email,
        data: {
          performerName: performer?.name || performer?.username,
          userName: user?.name || user?.username,
          order: { ...new OrderDto(order), name: product.name, description: product.description },
          digitalLink
        },
        template: 'send-user-digital-product'
      });
    }
  }

  private async sendPhysicalProduct(product: ProductModel, order: OrderModel, user: UserModel, performer: PerformerDto) {
    if (!performer.email) return;
    await this.mailService.send({
      subject: 'Product has been ordered',
      to: performer.email,
      data: {
        performerName: performer?.name || performer?.username,
        userName: user?.name || user?.username,
        order: { ...new OrderDto(order), name: product.name, description: product.description }
      },
      template: 'performer-physical-product'
    });
  }
}
