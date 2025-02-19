import {
  Injectable, Inject, ForbiddenException, HttpException, forwardRef
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { QueueEventService, EntityNotFoundException, getConfig } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { FileDto } from 'src/modules/file';
import { FileService } from 'src/modules/file/services';
import { REF_TYPE } from 'src/modules/file/constants';
import { Storage } from 'src/modules/storage/contants';
import { PerformerService } from 'src/modules/performer/services';
import { UserService } from 'src/modules/user/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { flatten, uniq } from 'lodash';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import { STREAM_EVENT } from 'src/modules/stream/gateways';
import {
  MessageModel, IRecipient
} from '../models';
import { MESSAGE_MODEL_PROVIDER } from '../providers/message.provider';
import { MessageCreatePayload } from '../payloads/message-create.payload';
import {
  CONVERSATION_TYPE,
  DELETE_MESSAGE_CHANNEL,
  MESSAGE_CHANNEL, MESSAGE_EVENT, MESSAGE_PRIVATE_STREAM_CHANNEL
} from '../constants';
import { MessageDto } from '../dtos';
import { ConversationService } from './conversation.service';
import { MessageListRequest } from '../payloads/message-list.payload';

@Injectable()
export class MessageService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    @Inject(MESSAGE_MODEL_PROVIDER)
    private readonly messageModel: Model<MessageModel>,
    private readonly queueEventService: QueueEventService,
    private readonly fileService: FileService,
    private readonly socketService: SocketUserService
  ) { }

  public async validatePhotoFile(
    file: FileDto,
    isPublic = false
  ) {
    if (!file.isImage()) {
      await this.fileService.remove(file._id);
      throw new HttpException('Invalid photo file', 422);
    }
    await this.fileService.queueProcessPhoto(file._id, {
      thumbnailSize: !isPublic ? getConfig('image').blurThumbnail : getConfig('image').originThumbnail
    });
  }

  public async validateVideoFile(video: FileDto): Promise<any> {
    if (!video.isVideo()) {
      await this.fileService.remove(video._id);
      throw new HttpException('Invalid video file', 422);
    }
    await this.fileService.queueProcessVideo(video._id, {
      count: 1
    });
    return true;
  }

  public async createPrivateMessage(
    conversationId: string | Types.ObjectId,
    payload: MessageCreatePayload,
    sender: IRecipient,
    jwToken: string
  ) {
    const conversation = await this.conversationService.findById(
      conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }
    const found = conversation.recipients.find(
      (recipient) => recipient.sourceId.toString() === sender.sourceId.toString()
    );
    if (!found) {
      throw new EntityNotFoundException();
    }
    const message = await this.messageModel.create({
      ...payload,
      senderId: sender.sourceId,
      senderSource: sender.source,
      conversationId: conversation._id
    });
    if (message.fileIds && message.fileIds.length) {
      message.fileIds.map((fileId) => this.fileService.addRef((fileId as any), {
        itemId: message._id,
        itemType: REF_TYPE.MESSAGE
      }));
    }
    const files = message.fileIds ? await this.fileService.findByIds(message.fileIds) : [];
    const dto = new MessageDto(message);
    dto.files = files && files.length > 0 && files.map((file) => {
      // track server s3 or local, assign jwToken if local
      let fileUrl = file.getUrl(true);
      if (file.server !== Storage.S3) {
        fileUrl = `${file.getUrl()}?messageId=${message._id}&token=${jwToken}`;
      }
      return {
        ...file.toResponse(),
        thumbnails: file.getThumbnails(),
        url: fileUrl
      };
    });

    await this.queueEventService.publish({
      channel: MESSAGE_CHANNEL,
      eventName: MESSAGE_EVENT.CREATED,
      data: dto
    });
    return dto;
  }

  public async loadPrivateMessages(req: MessageListRequest, user: UserDto, jwToken: string) {
    const conversation = await this.conversationService.findById(
      req.conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }

    const found = conversation.recipients.find(
      (recipient) => recipient.sourceId.toString() === user._id.toString()
    );

    if (!found) {
      throw new EntityNotFoundException();
    }

    const query = { conversationId: conversation._id } as any;
    const [data, total] = await Promise.all([
      this.messageModel
        .find(query)
        .sort({ createdAt: -1 })
        .lean()
        .limit(req.limit)
        .skip(req.offset),
      this.messageModel.countDocuments(query)
    ]);

    const fileIds = uniq(flatten(data.map((d) => d?.fileIds)));
    const files = fileIds && await this.fileService.findByIds(fileIds);
    const messages = data.map((m) => new MessageDto(m));
    messages.forEach((m) => {
      if (m?.fileIds && m.fileIds?.length > 0 && files && files.length > 0) {
        const _files = files.filter((f) => (`${m.fileIds}`).includes(`${f._id}`));
        // eslint-disable-next-line no-param-reassign
        m.files = _files.map((file) => {
          let fileUrl = file.getUrl(true);
          // track server s3 or local, assign jwtoken if local
          if (file.server !== Storage.S3) {
            fileUrl = `${file.getUrl()}?messageId=${m._id}&token=${jwToken}`;
          }
          return {
            ...file.toResponse(),
            thumbnails: file.getThumbnails(),
            url: fileUrl
          };
        });
      }
    });

    return {
      data: messages,
      total
    };
  }

  public async deleteMessage(messageId: string, user: UserDto) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new EntityNotFoundException();
    }
    if (
      user.roles
      && !user.roles.includes('admin')
      && message.senderId.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException();
    }
    if (message.conversationId) {
      const conversation = await this.conversationService.findById(message.conversationId);
      const channel = (conversation.type === CONVERSATION_TYPE.PRIVATE) ? MESSAGE_CHANNEL : MESSAGE_PRIVATE_STREAM_CHANNEL;
      const data = (conversation.type === CONVERSATION_TYPE.PRIVATE) ? message : { message, conversation };
      await Promise.all([
        this.queueEventService.publish({
          channel,
          eventName: MESSAGE_EVENT.DELETED,
          data
        }),
        this.queueEventService.publish({
          channel: DELETE_MESSAGE_CHANNEL,
          eventName: MESSAGE_EVENT.DELETED,
          data: {
            messageId: message._id
          }
        })
      ]);
    }
    return message;
  }

  // stream message
  public async loadPublicMessages(req: MessageListRequest) {
    const conversation = await this.conversationService.findById(
      req.conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }

    const query = { conversationId: conversation._id };
    const [data, total] = await Promise.all([
      this.messageModel
        .find(query)
        .sort({ createdAt: -1 })
        .lean()
        .limit(req.limit)
        .skip(req.offset),
      this.messageModel.countDocuments(query)
    ]);

    const senderIds = data.map((d) => d.senderId);
    const [users, performers] = await Promise.all([
      senderIds.length ? this.userService.findByIds(senderIds) : [],
      senderIds.length ? this.performerService.findByIds(senderIds) : []
    ]);

    const messages = data.map((message) => {
      let user = null;
      user = users.find((u) => u._id.toString() === message.senderId.toString());
      if (!user) {
        user = performers.find(
          (p) => p._id.toString() === message.senderId.toString()
        );
      }

      return {
        ...message,
        senderInfo: user ? new UserDto(user).toResponse() : new PerformerDto(user).toResponse()
      };
    });

    return {
      data: messages.map((m) => new MessageDto(m)),
      total
    };
  }

  public async createStreamMessageFromConversation(
    conversationId: string,
    payload: MessageCreatePayload,
    sender: IRecipient,
    user: UserDto
  ) {
    const conversation = await this.conversationService.findById(
      conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }
    const message = await this.messageModel.create({
      ...payload,
      senderId: sender.sourceId,
      senderSource: sender.source,
      conversationId: conversation._id
    });
    const dto = new MessageDto(message);
    dto.senderInfo = user;
    await this.queueEventService.publish({
      channel: MESSAGE_PRIVATE_STREAM_CHANNEL,
      eventName: MESSAGE_EVENT.CREATED,
      data: { message: dto, conversation }
    });
    return dto;
  }

  public async deleteAllMessageInConversation(
    conversationId: string,
    user: any
  ) {
    const conversation = await this.conversationService.findById(
      conversationId
    );
    if (!conversation) {
      throw new EntityNotFoundException();
    }
    if (
      conversation.performerId.toString() !== user._id.toString()
    ) {
      throw new ForbiddenException();
    }

    await this.messageModel.deleteMany({ conversationId: conversation._id });

    const roomName = `conversation-${conversation.type}-${conversation._id}`;
    await this.socketService.emitToRoom(roomName, `clear_all_messages_${conversation._id}`, {
      conversationId: conversation._id
    });
    return { success: true };
  }
}
