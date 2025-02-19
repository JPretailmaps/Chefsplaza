/* eslint-disable no-nested-ternary */
import {
  Injectable, Inject, forwardRef, HttpException
} from '@nestjs/common';
import {
  EntityNotFoundException,
  QueueEventService,
  QueueEvent
} from 'src/kernel';
import { EVENT } from 'src/kernel/constants';
import { Model, Types } from 'mongoose';
import {
  VideoService,
  ProductService,
  GalleryService
} from 'src/modules/performer-assets/services';
import { GalleryDto, VideoDto } from 'src/modules/performer-assets/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { PRODUCT_TYPE } from 'src/modules/performer-assets/constants';
import { FeedService } from 'src/modules/feed/services';
import { FeedDto } from 'src/modules/feed/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { toObjectId } from 'src/kernel/helpers/string.helper';
import { StreamService } from 'src/modules/stream/services';
import { StreamModel } from 'src/modules/stream/models';
import {
  GROUP_CHAT,
  PRIVATE_CHAT,
  PUBLIC_CHAT
} from 'src/modules/stream/constant';
import { UserDto } from 'src/modules/user/dtos';
import { MessageService } from 'src/modules/message/services';
import { MESSAGE_TYPE } from 'src/modules/message/constants';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { PAYMENT_TOKEN_MODEL_PROVIDER } from '../providers';
import { TokenTransactionModel } from '../models';
import {
  PURCHASE_ITEM_TYPE,
  PURCHASE_ITEM_TARTGET_TYPE,
  TOKEN_TRANSACTION_SUCCESS_CHANNEL,
  PURCHASE_ITEM_STATUS,
  PURCHASE_ITEM_TARGET_SOURCE,
  PurchaseItemType
} from '../constants';
import {
  NotEnoughMoneyException,
  OverProductStockException
} from '../exceptions';
import { PurchaseProductsPayload, SendTipsPayload } from '../payloads';
import { TokenTransactionDto } from '../dtos';

@Injectable()
export class TokenTransactionService {
  constructor(
    @Inject(PAYMENT_TOKEN_MODEL_PROVIDER)
    private readonly TokenPaymentModel: Model<TokenTransactionModel>,
    private readonly queueEventService: QueueEventService,
    private readonly socketUserService: SocketUserService,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => GalleryService))
    private readonly galleryService: GalleryService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    @Inject(forwardRef(() => StreamService))
    private readonly streamService: StreamService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService
  ) {}

  public async findById(id: string | Types.ObjectId) {
    return this.TokenPaymentModel.findById(id);
  }

  public async checkBought(item: any, type: PurchaseItemType, user: UserDto) {
    if (!user) return false;
    if (
      `${user._id}` === `${item.performerId}`
      || `${user._id}` === `${item.fromSourceId}`
    ) { return true; }
    const transaction = await this.TokenPaymentModel.findOne({
      type,
      targetId: item._id,
      sourceId: user._id,
      status: PURCHASE_ITEM_STATUS.SUCCESS
    });
    return !!transaction;
  }

  public async purchaseProduct(
    id: string,
    user: PerformerDto,
    payload: PurchaseProductsPayload
  ) {
    const product = await this.productService.findById(id);
    if (!product) throw new EntityNotFoundException();

    const quantity = payload.quantity || 1;
    const totalPrice = quantity * product.price;

    if (user.balance < totalPrice) {
      throw new NotEnoughMoneyException();
    }

    if (product.type === PRODUCT_TYPE.PHYSICAL && quantity > product.stock) {
      throw new OverProductStockException();
    }

    const storeProducts = [
      {
        quantity,
        price: totalPrice,
        name: product.name,
        description: `purchase product ${product.name} x${quantity}`,
        productId: product._id,
        productType: product.type,
        performerId: product.performerId
      }
    ];

    const transaction = await this.createPaymentTokenProduct(
      storeProducts,
      totalPrice,
      user
    );

    // TODO - earning listener, order listener
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TOKEN_TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: {
          ...new TokenTransactionDto(transaction),
          ...{ shippingInfo: payload }
        }
      })
    );

    return transaction;
  }

  public async createPaymentTokenProduct(
    products: any[],
    totalPrice: number,
    user: PerformerDto
  ) {
    const paymentTransaction = new this.TokenPaymentModel();
    paymentTransaction.originalPrice = totalPrice;
    paymentTransaction.source = PURCHASE_ITEM_TARGET_SOURCE.USER;
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = PURCHASE_ITEM_TARTGET_TYPE.PRODUCT;
    paymentTransaction.targetId = products[0] && products[0].productId;
    paymentTransaction.performerId = products[0] && products[0].performerId;
    paymentTransaction.type = PURCHASE_ITEM_TYPE.PRODUCT;
    paymentTransaction.totalPrice = totalPrice;
    paymentTransaction.products = products;
    paymentTransaction.status = PURCHASE_ITEM_STATUS.SUCCESS;
    return paymentTransaction.save();
  }

  public async purchaseStream(streamId: string, user: UserDto) {
    const stream = await this.streamService.findOne({ _id: streamId });
    if (stream.isFree) {
      return { success: true };
    }
    const performer = await this.performerService.findById(stream.performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }
    let purchaseItemType = '';
    switch (stream.type) {
      case PUBLIC_CHAT:
        purchaseItemType = PURCHASE_ITEM_TYPE.PUBLIC_CHAT;
        break;
      case GROUP_CHAT:
        purchaseItemType = PURCHASE_ITEM_TYPE.GROUP_CHAT;
        break;
      case PRIVATE_CHAT:
        purchaseItemType = PURCHASE_ITEM_TYPE.PRIVATE_CHAT;
        break;
      default:
        break;
    }

    if (user.balance < stream.price) throw new NotEnoughMoneyException();
    const transaction = await this.createPaymentTokenStream(
      stream,
      purchaseItemType,
      performer,
      user
    );
    // TODO - earning listener, order listener
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TOKEN_TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new TokenTransactionDto(transaction)
      })
    );
    await this.socketUserService.emitToUsers(
      transaction.sourceId,
      'token_transaction_success',
      { item: stream }
    );
    return transaction;
  }

  public async createPaymentTokenStream(
    stream: StreamModel,
    purchaseItemType: string,
    performer: any,
    user: UserDto
  ) {
    const paymentTransaction = new this.TokenPaymentModel();
    paymentTransaction.originalPrice = stream.price;
    paymentTransaction.source = PURCHASE_ITEM_TARGET_SOURCE.USER;
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = PURCHASE_ITEM_TARTGET_TYPE.STREAM;
    paymentTransaction.targetId = stream._id;
    paymentTransaction.sessionId = stream.sessionId;
    paymentTransaction.performerId = stream.performerId;
    paymentTransaction.type = purchaseItemType;
    paymentTransaction.totalPrice = stream.price;
    paymentTransaction.products = [
      {
        name: `${purchaseItemType} ${performer?.name
          || performer?.username
          || 'N/A'}`,
        description: `${purchaseItemType} ${performer?.name
          || performer?.username
          || 'N/A'}`,
        price: stream.price,
        productId: stream._id,
        productType: PURCHASE_ITEM_TARTGET_TYPE.STREAM,
        performerId: stream.performerId,
        quantity: 1
      }
    ];
    paymentTransaction.status = PURCHASE_ITEM_STATUS.SUCCESS;
    return paymentTransaction.save();
  }

  public async purchaseVideo(id: string, user: PerformerDto) {
    const video = await this.videoService.findById(id);
    if (!video || (video && !video.isSale) || (video && !video.price)) {
      throw new EntityNotFoundException();
    }
    if (user.balance < video.price) throw new NotEnoughMoneyException();
    const transaction = await this.createPaymentTokenVideo(video, user);
    // TODO - earning listener, order listener
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TOKEN_TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new TokenTransactionDto(transaction)
      })
    );
    await this.socketUserService.emitToUsers(
      transaction.sourceId,
      'token_transaction_success',
      { item: video }
    );
    return transaction;
  }

  public async createPaymentTokenVideo(video: VideoDto, user: PerformerDto) {
    const paymentTransaction = new this.TokenPaymentModel();
    paymentTransaction.originalPrice = video.price;
    paymentTransaction.source = PURCHASE_ITEM_TARGET_SOURCE.USER;
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = PURCHASE_ITEM_TARTGET_TYPE.VIDEO;
    paymentTransaction.targetId = video._id;
    paymentTransaction.performerId = video.performerId;
    paymentTransaction.type = PURCHASE_ITEM_TYPE.VIDEO;
    paymentTransaction.totalPrice = video.price;
    paymentTransaction.products = [
      {
        name: video.title,
        description: `purchase video ${video.title}`,
        price: video.price,
        productId: video._id,
        productType: PURCHASE_ITEM_TARTGET_TYPE.VIDEO,
        performerId: video.performerId,
        quantity: 1
      }
    ];
    paymentTransaction.status = PURCHASE_ITEM_STATUS.SUCCESS;
    return paymentTransaction.save();
  }

  public async purchaseGallery(id: string | Types.ObjectId, user: PerformerDto) {
    const gallery = await this.galleryService.findById(id);
    if (!gallery || (gallery && !gallery.price)) {
      throw new EntityNotFoundException();
    }
    if (user.balance < gallery.price) throw new NotEnoughMoneyException();
    const transaction = await this.createPaymentTokenPhotoGallery(
      gallery,
      user
    );
    // TODO - earning listener, order listener
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TOKEN_TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new TokenTransactionDto(transaction)
      })
    );

    await this.socketUserService.emitToUsers(
      transaction.sourceId,
      'token_transaction_success',
      { item: gallery }
    );
    return transaction;
  }

  public async createPaymentTokenPhotoGallery(
    gallery: GalleryDto,
    user: PerformerDto
  ) {
    const paymentTransaction = new this.TokenPaymentModel();
    paymentTransaction.originalPrice = gallery.price;
    paymentTransaction.source = PURCHASE_ITEM_TARGET_SOURCE.USER;
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = PURCHASE_ITEM_TARTGET_TYPE.GALLERY;
    paymentTransaction.targetId = gallery._id;
    paymentTransaction.performerId = gallery.performerId;
    paymentTransaction.type = PURCHASE_ITEM_TYPE.GALLERY;
    paymentTransaction.totalPrice = gallery.price;
    paymentTransaction.products = [
      {
        name: gallery.title,
        description: `purchase gallery ${gallery.title}`,
        price: gallery.price,
        productId: gallery._id,
        productType: PURCHASE_ITEM_TARTGET_TYPE.GALLERY,
        performerId: gallery.performerId,
        quantity: 1
      }
    ];
    paymentTransaction.status = PURCHASE_ITEM_STATUS.SUCCESS;
    return paymentTransaction.save();
  }

  public async sendTips(user: UserDto, performerId: string, payload: SendTipsPayload) {
    const {
      price, conversationId, streamType, sessionId
    } = payload;
    const performer = await this.performerService.findById(performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }

    if (!price || user.balance < price) {
      throw new NotEnoughMoneyException();
    }
    const minTipPrice = SettingService.getValueByKey(SETTING_KEYS.MINIMUM_TIP_PRICE) || 1;
    const maxTipPrice = SettingService.getValueByKey(SETTING_KEYS.MAXIMUM_TIP_PRICE) || 1000;
    if (price < minTipPrice) {
      throw new HttpException(`Minimum tip amount is $${minTipPrice}`, 422);
    }
    if (price > maxTipPrice) {
      throw new HttpException(`Maximum tip amount is $${maxTipPrice}`, 422);
    }

    const paymentTransaction = new this.TokenPaymentModel();
    paymentTransaction.originalPrice = price;
    paymentTransaction.totalPrice = price;
    paymentTransaction.source = 'user';
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = conversationId && streamType
      ? PURCHASE_ITEM_TARTGET_TYPE.STREAM
      : PURCHASE_ITEM_TARTGET_TYPE.PERFORMER;
    paymentTransaction.targetId = performer._id;
    paymentTransaction.performerId = performer._id;
    paymentTransaction.sessionId = sessionId;
    paymentTransaction.type = conversationId && streamType
      ? PURCHASE_ITEM_TYPE.STREAM_TIP
      : PURCHASE_ITEM_TYPE.TIP;
    paymentTransaction.products = [
      {
        name: `Tip to ${performer.name || performer.username || performer._id}`,
        description: `Tip $${price} to ${performer.name
          || performer.username
          || performer._id}`,
        price,
        productId: performer._id,
        productType: PURCHASE_ITEM_TARTGET_TYPE.PERFORMER,
        performerId: performer._id,
        quantity: 1
      }
    ];
    paymentTransaction.status = PURCHASE_ITEM_STATUS.SUCCESS;
    await paymentTransaction.save();
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TOKEN_TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new TokenTransactionDto(paymentTransaction)
      })
    );
    if (conversationId && streamType) {
      // send notification to room chat
      await this.messageService.createStreamMessageFromConversation(
        conversationId,
        {
          type: MESSAGE_TYPE.TIP,
          text: `${user?.name || user?.username} tipped $${price.toFixed(2)}`,
          fileIds: []
        },
        {
          source: paymentTransaction.source,
          sourceId: paymentTransaction.sourceId
        },
        user
      );
    }
    return paymentTransaction;
  }

  public async purchasePostFeed(id: string | Types.ObjectId, user: PerformerDto) {
    const feed = await this.feedService.findById(id);
    if (!feed || (feed && !feed.price)) {
      throw new EntityNotFoundException();
    }
    if (user.balance < feed.price) throw new NotEnoughMoneyException();
    const transaction = await this.createPaymentTokenFeed(
      new FeedDto(feed),
      user
    );
    // TODO - earning listener, order listener
    await this.queueEventService.publish(
      new QueueEvent({
        channel: TOKEN_TRANSACTION_SUCCESS_CHANNEL,
        eventName: EVENT.CREATED,
        data: new TokenTransactionDto(transaction)
      })
    );
    await this.socketUserService.emitToUsers(
      transaction.sourceId,
      'token_transaction_success',
      { item: new FeedDto(feed) }
    );
    return transaction;
  }

  public async createPaymentTokenFeed(feed: FeedDto, user: PerformerDto) {
    const paymentTransaction = new this.TokenPaymentModel();
    paymentTransaction.originalPrice = feed.price;
    paymentTransaction.source = PURCHASE_ITEM_TARGET_SOURCE.USER;
    paymentTransaction.sourceId = user._id;
    paymentTransaction.target = PURCHASE_ITEM_TARTGET_TYPE.FEED;
    paymentTransaction.targetId = toObjectId(feed._id);
    paymentTransaction.performerId = toObjectId(feed.fromSourceId);
    paymentTransaction.type = PURCHASE_ITEM_TYPE.FEED;
    paymentTransaction.totalPrice = feed.price;
    paymentTransaction.products = [
      {
        name: 'Purchase post feed',
        description: feed.text,
        price: feed.price,
        productId: toObjectId(feed._id),
        productType: PURCHASE_ITEM_TARTGET_TYPE.FEED,
        performerId: toObjectId(feed.fromSourceId),
        quantity: 1
      }
    ];
    paymentTransaction.status = PURCHASE_ITEM_STATUS.SUCCESS;
    return paymentTransaction.save();
  }

  public findOne(filter) {
    return this.TokenPaymentModel.findOne(filter);
  }
}
