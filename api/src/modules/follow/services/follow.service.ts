/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  PageableData, EntityNotFoundException
} from 'src/kernel';
import { uniq } from 'lodash';
import { PerformerDto } from 'src/modules/performer/dtos';
import { UserDto } from 'src/modules/user/dtos';
import { UserService } from 'src/modules/user/services';
import { MailerService } from 'src/modules/mailer';
import { FollowModel } from '../models/follow.model';
import { FOLLOW_MODEL_PROVIDER } from '../providers';
import {
  FollowSearchRequestPayload
} from '../payloads';
import { FollowDto } from '../dtos/follow.dto';
import { PerformerService } from '../../performer/services';

@Injectable()
export class FollowService {
  constructor(
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(FOLLOW_MODEL_PROVIDER)
    private readonly followModel: Model<FollowModel>,
    private readonly mailerService: MailerService
  ) { }

  public async countOne(query) {
    return this.followModel.countDocuments(query);
  }

  public async findOne(query) {
    return this.followModel.findOne(query);
  }

  public async find(query) {
    return this.followModel.find(query);
  }

  public async create(
    followingId: string,
    user: UserDto
  ): Promise<FollowDto> {
    let follow = await this.followModel.findOne({
      followerId: user._id,
      followingId
    });
    if (follow) {
      return new FollowDto(follow);
    }
    follow = await this.followModel.create({
      followerId: user._id,
      followingId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const [performer] = await Promise.all([
      this.performerService.findById(follow.followingId),
      this.performerService.updateStats(followingId, { 'stats.followers': 1 }),
      this.userService.updateStats(user._id, { 'stats.following': 1 })
    ]);

    performer?.email && await this.mailerService.send({
      subject: 'User follow/unfollow',
      to: performer?.email,
      data: {
        userName: user?.name || user?.username,
        action: 'followed'
      },
      template: 'performer-follow'
    });

    return new FollowDto(follow);
  }

  public async remove(followingId: string, user: UserDto) {
    const follow = await this.followModel.findOne({
      followerId: user._id,
      followingId
    });
    if (!follow) {
      throw new EntityNotFoundException();
    }
    await this.followModel.deleteOne({ _id: follow._id });
    const [performer] = await Promise.all([
      this.performerService.findById(follow.followingId),
      this.performerService.updateStats(followingId, { 'stats.followers': -1 }),
      this.userService.updateStats(user._id, { 'stats.following': -1 })
    ]);

    performer?.email && await this.mailerService.send({
      subject: 'User follow/unfollow',
      to: performer?.email,
      data: {
        userName: user?.name || user?.username,
        action: 'unfollowed'
      },
      template: 'performer-follow'
    });
    return true;
  }

  public async search(
    req: FollowSearchRequestPayload
  ): Promise<PageableData<FollowDto>> {
    const query = {} as any;
    if (req.followerId) {
      query.followerId = req.followerId;
    }
    if (req.followingId) {
      query.followingId = req.followingId;
    }
    const sort = {
      createdAt: -1
    } as any;
    const [data, total] = await Promise.all([
      this.followModel
        .find(query)
        .sort(sort)
        .lean()
        .limit(req.limit)
        .skip(req.offset),
      this.followModel.countDocuments(query)
    ]);
    const follows = data.map((d) => new FollowDto(d));
    const followerIds = uniq(data.map((d) => d.followerId));
    const followingIds = uniq(data.map((d) => d.followingId));
    const [users, performers] = await Promise.all([
      followerIds.length ? this.userService.findByIds(followerIds) : [],
      followingIds.length ? this.performerService.findByIds(followingIds) : []

    ]);
    follows.forEach((follow: FollowDto) => {
      const followerInfo = users.find(
        (p) => `${p._id}` === `${follow.followerId}`
      );
      const followingInfo = performers.find(
        (p) => `${p._id}` === `${follow.followingId}`
      );
      // eslint-disable-next-line no-param-reassign
      follow.followerInfo = followerInfo ? new UserDto(followerInfo).toResponse() : null;
      // eslint-disable-next-line no-param-reassign
      follow.followingInfo = followingInfo ? new PerformerDto(followingInfo).toResponse() : null;
    });
    return {
      data: follows,
      total
    };
  }
}
