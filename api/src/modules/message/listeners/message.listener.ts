import { Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  EntityNotFoundException, QueueEvent, QueueEventService, StringHelper
} from 'src/kernel';
import { Model } from 'mongoose';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { StreamService } from 'src/modules/stream/services';
import { FileService } from 'src/modules/file/services';
import {
  DELETE_MESSAGE_CHANNEL, MESSAGE_CHANNEL, MESSAGE_EVENT, MESSAGE_PRIVATE_STREAM_CHANNEL
} from '../constants';
import { MessageDto } from '../dtos';
import { CONVERSATION_MODEL_PROVIDER, MESSAGE_MODEL_PROVIDER, NOTIFICATION_MESSAGE_MODEL_PROVIDER } from '../providers';
import { ConversationModel, NotificationMessageModel, MessageModel } from '../models';

const MESSAGE_NOTIFY = 'MESSAGE_NOTIFY';
const MESSAGE_STREAM_NOTIFY = 'MESSAGE_STREAM_NOTIFY';
const DELETE_MESSAGE_TOPIC = 'DELETE_MESSAGE_TOPIC';

@Injectable()
export class MessageListener {
  constructor(
    @Inject(forwardRef(() => StreamService))
    private readonly streamService: StreamService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(CONVERSATION_MODEL_PROVIDER)
    private readonly conversationModel: Model<ConversationModel>,
    @Inject(NOTIFICATION_MESSAGE_MODEL_PROVIDER)
    private readonly NotificationModel: Model<NotificationMessageModel>,
    @Inject(MESSAGE_MODEL_PROVIDER)
    private readonly messageModel: Model<MessageModel>,
    private readonly queueEventService: QueueEventService,
    private readonly socketUserService: SocketUserService
  ) {
    this.queueEventService.subscribe(
      MESSAGE_CHANNEL,
      MESSAGE_NOTIFY,
      this.handleMessage.bind(this)
    );
    this.queueEventService.subscribe(
      MESSAGE_PRIVATE_STREAM_CHANNEL,
      MESSAGE_STREAM_NOTIFY,
      this.handleStreamMessage.bind(this)
    );
    this.queueEventService.subscribe(
      DELETE_MESSAGE_CHANNEL,
      DELETE_MESSAGE_TOPIC,
      this.handleDeleteMessage.bind(this)
    );
  }

  private async handleMessage(event: QueueEvent): Promise<void> {
    if (![MESSAGE_EVENT.CREATED, MESSAGE_EVENT.DELETED].includes(event.eventName)) return;
    const message = event.data as MessageDto;

    const conversation = await this.conversationModel
      .findOne({ _id: message.conversationId })
      .lean()
      .exec();
    if (!conversation) return;
    const recipient = conversation.recipients.find(
      (r) => r.sourceId.toString() !== message.senderId.toString()
    );
    if (event.eventName === MESSAGE_EVENT.CREATED) {
      await this.updateNotification(conversation, recipient);
      await this.handleSent(recipient.sourceId, message);
      await this.updateLastMessage(conversation, message);
    } else if (event.eventName === MESSAGE_EVENT.DELETED) {
      const lastMessage = await this.messageModel
        .findOne({ conversationId: conversation._id })
        .sort({ createdAt: -1 })
        .lean();
      await this.handleDelete(recipient.sourceId, message);
      await this.updateLastMessage(conversation, lastMessage);
    }
  }

  private async updateLastMessage(conversation, message: MessageDto | MessageModel): Promise<void> {
    const lastMessage = StringHelper.truncate(message.text || '', 30);
    const lastSenderId = message.senderId;
    const lastMessageCreatedAt = message.createdAt;
    await this.conversationModel.updateOne({ _id: conversation._id }, {
      $set: {
        lastMessage,
        lastSenderId,
        lastMessageCreatedAt
      }
    });
  }

  public async handleDeleteMessage(event: QueueEvent) {
    if (event.eventName !== MESSAGE_EVENT.DELETED) return;
    const { messageId } = event.data;
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new EntityNotFoundException();
    await Promise.all([
      this.messageModel.deleteOne({ _id: message._id }),
      message.fileIds && message.fileIds.length > 0 && this.fileService.removeMany(message.fileIds)
    ]);
    // await this.socketUserService.emitToUsers(recipient.sourceId, 'message_deleted', messageDetail);
  }

  // eslint-disable-next-line consistent-return
  private async updateNotification(conversation, recipient): Promise<void> {
    let notification = await this.NotificationModel.findOne({
      recipientId: recipient.sourceId,
      conversationId: conversation._id
    });
    if (!notification) {
      notification = new this.NotificationModel({
        recipientId: recipient.sourceId,
        conversationId: conversation._id,
        totalNotReadMessage: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    notification.totalNotReadMessage += 1;
    await notification.save();
    const totalNotReadMessage = await this.NotificationModel.aggregate<any>([
      {
        $match: { recipientId: recipient.sourceId }
      },
      {
        $group: {
          _id: '$conversationId',
          total: {
            $sum: '$totalNotReadMessage'
          }
        }
      }
    ]);
    let total = 0;
    totalNotReadMessage && totalNotReadMessage.length && totalNotReadMessage.forEach((data) => {
      if (data.total) {
        total += 1;
      }
    });
    await this.notifyCountingNotReadMessageInConversation(recipient.sourceId, total);
  }

  private async notifyCountingNotReadMessageInConversation(receiverId, total): Promise<void> {
    await this.socketUserService.emitToUsers(receiverId, 'nofify_read_messages_in_conversation', { total });
  }

  private async handleSent(recipientId, message): Promise<void> {
    await this.socketUserService.emitToUsers(recipientId, 'message_created', message);
  }

  private async handleDelete(recipientId, message): Promise<void> {
    await this.socketUserService.emitToUsers(recipientId, 'message_deleted', message);
  }

  private async handleStreamMessage(event: QueueEvent): Promise<void> {
    if (![MESSAGE_EVENT.CREATED, MESSAGE_EVENT.DELETED].includes(event.eventName)) return;
    const { message, conversation } = event.data;
    const roomName = this.streamService.getRoomName(conversation._id, conversation.type);
    await this.socketUserService.emitToRoom(roomName, `message_${event.eventName}_conversation_${conversation._id}`, message);
  }
}
