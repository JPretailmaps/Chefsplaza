import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Inject, forwardRef } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/services';
import { StreamService } from 'src/modules/stream/services';
import { PUBLIC_CHAT } from 'src/modules/stream/constant';
import { SocketUserService } from 'src/modules/socket/services/socket-user.service';
import * as moment from 'moment';
import { PerformerService } from 'src/modules/performer/services';
import { ConversationService } from 'src/modules/message/services';
import { UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { SubscriptionService } from 'src/modules/subscription/services/subscription.service';
import { FollowService } from 'src/modules/follow/services/follow.service';
import { MailerService } from 'src/modules/mailer/services';
import { uniq } from 'lodash';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { StreamModel } from '../models';
import { STREAM_MODEL_PROVIDER } from '../providers/stream.provider';

export const STREAM_EVENT = {
  JOIN_BROADCASTER: 'join-broadcaster',
  MODEL_JOINED: 'model-joined',
  MODEL_LEFT: 'model-left',
  ROOM_INFORMATIOM_CHANGED: 'public-room-changed',
  LEAVE_ROOM: 'public-stream/leave',
  JOIN_ROOM: 'public-stream/join',
  GO_LIVE: 'public-stream/live',
  ADMIN_END_SESSION_STREAM: 'admin-end-session-stream'
};

@WebSocketGateway()
export class PublicStreamWsGateway {
  constructor(
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    @Inject(forwardRef(() => SocketUserService))
    private readonly socketService: SocketUserService,
    @Inject(STREAM_MODEL_PROVIDER)
    private readonly streamModel: Model<StreamModel>,
    private readonly streamService: StreamService,
    private readonly mailService: MailerService
  ) { }

  @SubscribeMessage(STREAM_EVENT.GO_LIVE)
  async goLive(client: Socket, payload: { conversationId: string }) {
    const { conversationId } = payload;
    if (!conversationId) return;
    const conversation = await this.conversationService.findById(conversationId);
    if (!conversation) return;
    const { token } = client.handshake.query as any;
    if (!token) return;
    const authUser = token && await this.authService.verifySession(token);
    const user = authUser && await this.authService.getSourceFromAuthSession({
      source: authUser.source,
      sourceId: authUser.sourceId
    });
    if (!user) return;
    const stream = await this.streamService.findOne({ _id: conversation.streamId });
    if (!stream) return;
    const roomName = this.streamService.getRoomName(conversation._id, conversation.type);
    this.socketService.emitToRoom(roomName, STREAM_EVENT.JOIN_BROADCASTER, {
      performerId: user._id,
      conversationId
    });
    await Promise.all([
      this.performerService.goLive(user._id),
      this.streamModel.updateOne({ _id: conversation.streamId }, { $set: { isStreaming: 1 } })
    ]);
    const [subs, follows] = await Promise.all([
      this.subscriptionService.findSubscriptionList({
        performerId: user._id
      }),
      this.followService.find({
        followingId: user._id
      })
    ]);
    const suids = subs.map((s) => s.userId.toString());
    const fuids = follows.map((s) => s.followerId.toString());
    const users = await this.userService.find({ _id: uniq(suids.concat(fuids)) });
    const redirectLink = `${process.env.USER_URL}/streaming/${user.username}`;
    await users.reduce(async (cb, u) => {
      await cb;
      u.email && await this.mailService.send({
        subject: 'New live stream',
        to: u.email,
        data: {
          redirectLink,
          performerName: user.name || user.username
        },
        template: 'performer-live-notify-followers'
      });
    }, Promise.resolve());
    const adminEmail = SettingService.getValueByKey(SETTING_KEYS.ADMIN_EMAIL);
    adminEmail && await this.mailService.send({
      subject: 'New live stream',
      to: adminEmail,
      data: {
        redirectLink,
        performerName: user.name || user.username
      },
      template: 'performer-live-notify-admin'
    });
  }

  @SubscribeMessage(STREAM_EVENT.JOIN_ROOM)
  async handleJoinPublicRoom(
    client: Socket,
    payload: { conversationId: string }
  ): Promise<void> {
    const { token } = client.handshake.query as any;
    const { conversationId } = payload;
    if (!conversationId) return;
    const conversation = conversationId && await this.conversationService.findById(conversationId);
    if (!conversation) return;
    const { performerId, type } = conversation;
    const authUser = token && await this.authService.verifySession(token as string);
    let user = authUser && await this.performerService.findById(authUser?.sourceId) as any;
    if (!user) {
      user = authUser && await this.userService.findById(authUser?.sourceId);
    }
    const roomName = this.streamService.getRoomName(conversationId, type);
    await client.join(roomName);
    let role = 'guest';
    if (user) {
      role = `${user._id}` === `${performerId}` ? 'model' : 'member';
      // await this.socketService.emitToRoom(
      //   roomName,
      //   `user_joined_${conversationId}`,
      //   {
      //     user,
      //     role,
      //     conversationId
      //   }
      // );
    }

    if (role === 'model') {
      await this.performerService.setStreamingStatus(user._id, PUBLIC_CHAT);
    }
    await this.socketService.addConnectionToRoom(
      roomName,
      user ? user._id : client.id,
      role
    );
    const connections = await this.socketService.getRoomUserConnections(
      roomName
    );
    const memberIds: string[] = [];
    Object.keys(connections).forEach((id) => {
      const value = connections[id].split(',');
      if (value[0] === 'member') {
        memberIds.push(id);
      }
    });

    if (memberIds.length && role === 'model') {
      await this.socketService.emitToUsers(memberIds, STREAM_EVENT.MODEL_JOINED, { conversationId });
    }

    const members = (memberIds.length && await this.userService.findByIds(memberIds)) || [];
    const data = {
      conversationId,
      total: members.length,
      members: members.map((m) => new UserDto(m).toResponse())
    };
    await this.socketService.emitToRoom(roomName, STREAM_EVENT.ROOM_INFORMATIOM_CHANGED, data);

    const stream = await this.streamService.findByPerformerId(performerId, {
      type: PUBLIC_CHAT
    });
    if (!stream) return;
    if (role !== 'model') {
      await this.streamModel.updateOne(
        { _id: stream._id },
        { $set: { $inc: { 'stats.members': 1 } } }
      );
    }
    if (stream.isStreaming) {
      await this.socketService.emitToRoom(roomName, STREAM_EVENT.JOIN_BROADCASTER, {
        performerId,
        conversationId
      });
    }
  }

  @SubscribeMessage(STREAM_EVENT.LEAVE_ROOM)
  async handleLeavePublicRoom(
    client: Socket,
    payload: { conversationId: string }
  ): Promise<void> {
    const { token } = client.handshake.query as any;
    const { conversationId } = payload;
    if (!conversationId) {
      return;
    }
    const conversation = payload.conversationId && await this.conversationService.findById(conversationId);
    if (!conversation) {
      return;
    }

    const { performerId, type } = conversation;
    const authUser = token && await this.authService.verifySession(token);
    let user = authUser && await this.performerService.findById(authUser?.sourceId) as any;
    if (!user) {
      user = authUser && await this.userService.findById(authUser?.sourceId);
    }
    const roomName = this.streamService.getRoomName(conversationId, type);
    await client.leave(roomName);
    const stream = await this.streamService.findByPerformerId(performerId, {
      type: PUBLIC_CHAT
    });
    if (user) {
      const results = await this.socketService.getConnectionValue(
        roomName,
        user._id
      );
      if (results) {
        const values = results.split(',');
        const timeJoined = values[1] ? parseInt(values[1], 10) : null;
        const role = values[0];
        if (timeJoined) {
          const streamTime = moment()
            .toDate()
            .getTime() - timeJoined;

          if (role === 'model') {
            await Promise.all([
              this.performerService.updateLastStreamingTime(
                user._id,
                streamTime
              ),
              stream && stream.isStreaming && this.streamModel.updateOne(
                { _id: stream._id },
                { $set: { lastStreamingTime: new Date(), isStreaming: 0, streamingTime: streamTime / 1000 } }
              )
            ]);
          } else if (role === 'member') {
            await this.streamModel.updateOne(
              { _id: stream._id },
              { $set: { $inc: { 'stats.members': -1 } } }
            );
          }
        }
      }
    }

    await this.socketService.removeConnectionFromRoom(
      roomName,
      user ? user._id : client.id
    );

    const connections = await this.socketService.getRoomUserConnections(
      roomName
    );
    const memberIds: string[] = [];
    Object.keys(connections).forEach((id) => {
      const value = connections[id].split(',');
      if (value[0] === 'member') {
        memberIds.push(id);
      }
    });
    const members = await this.userService.findByIds(memberIds);
    const data = {
      conversationId,
      total: members.length,
      members: members.map((m) => new UserDto(m).toResponse())
    };

    if (memberIds.length && user instanceof PerformerDto) {
      await this.socketService.emitToUsers(memberIds, STREAM_EVENT.MODEL_LEFT, { conversationId, performerId });
    }
    await this.socketService.emitToRoom(roomName, STREAM_EVENT.ROOM_INFORMATIOM_CHANGED, data);
  }
}
