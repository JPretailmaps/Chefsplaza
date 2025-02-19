import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageableData, EntityNotFoundException } from 'src/kernel';
import { uniq } from 'lodash';
import { PerformerDto } from 'src/modules/performer/dtos';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { MailerService } from 'src/modules/mailer';
import { FeedService } from 'src/modules/feed/services';
import { ReportModel } from '../models/report.model';
import { REPORT_MODEL_PROVIDER } from '../providers';
import {
  ReportSearchRequestPayload, ReportCreatePayload
} from '../payloads';
import { UserDto } from '../../user/dtos';
import { ReportDto } from '../dtos/report.dto';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';

@Injectable()
export class ReportService {
  constructor(
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    @Inject(forwardRef(() => PerformerService))
    private readonly performerService: PerformerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(REPORT_MODEL_PROVIDER)
    private readonly reportModel: Model<ReportModel>,
    @Inject(forwardRef(() => MailerService))
    private readonly mailService: MailerService

  ) { }

  public async create(
    payload: ReportCreatePayload,
    user: UserDto
  ): Promise<ReportDto> {
    const existReport = await this.reportModel.findOne({
      target: payload.target,
      targetId: payload.targetId,
      sourceId: user._id
    });
    if (existReport) {
      existReport.description = payload.description;
      await existReport.save();
      return new ReportDto(existReport);
    }
    const data = { ...payload } as any;
    data.sourceId = user._id;
    data.source = user.isPerformer ? 'performer' : 'user';
    data.createdAt = new Date();
    data.updatedAt = new Date();
    const newreport = await this.reportModel.create(data);
    const adminEmail = SettingService.getValueByKey(SETTING_KEYS.ADMIN_EMAIL);
    const feed = await this.feedService.findById(newreport.targetId);
    const performer = feed && await this.performerService.findById(feed.fromSourceId);
    await Promise.all([
      adminEmail && this.mailService.send({
        subject: 'New reportion',
        to: adminEmail,
        data: {
          userName: user?.name || user?.username,
          link: `${process.env.USER_URL}/post/${newreport.targetId}`,
          title: newreport.title,
          description: newreport.description
        },
        template: 'admin-report'
      }),
      performer?.email && await this.mailService.send({
        subject: 'New reportion',
        to: performer?.email,
        data: {
          userName: user?.name || user?.username,
          link: `${process.env.USER_URL}/post/${newreport.targetId}`,
          title: newreport.title,
          description: newreport.description
        },
        template: 'performer-report'
      })
    ]);
    return new ReportDto(newreport);
  }

  public async remove(id) {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new EntityNotFoundException();
    }
    await this.reportModel.deleteOne({ _id: report._id });
    return { deleted: true };
  }

  public async search(
    req: ReportSearchRequestPayload
  ): Promise<PageableData<ReportDto>> {
    const query = {} as any;
    if (req.sourceId) {
      query.sourceId = req.sourceId;
    }
    if (req.source) {
      query.source = req.source;
    }
    if (req.performerId) {
      query.performerId = req.performerId;
    }
    if (req.targetId) {
      query.targetId = req.targetId;
    }
    if (req.target) {
      query.target = req.target;
    }
    const sort = {
      createdAt: -1
    } as any;
    const [data, total] = await Promise.all([
      this.reportModel
        .find(query)
        .sort(sort)
        .lean()
        .limit(req.limit)
        .skip(req.offset),
      this.reportModel.countDocuments(query)
    ]);
    const reports = data.map((d) => new ReportDto(d));
    const userIds = data.map((d) => d.sourceId);
    const performerIds = data.map((d) => d.performerId);
    const [users, performers] = await Promise.all([
      userIds.length ? this.userService.findByIds(userIds) : [],
      performerIds.length ? this.performerService.findByIds(performerIds.concat(userIds)) : []
    ]);
    reports.forEach((report: ReportDto) => {
      const user = users.find((u) => `${u?._id}` === `${report?.sourceId}`) || performers.find((p) => `${p?._id}` === `${report?.sourceId}`);
      const performer = performers.find((p) => `${p?._id}` === `${report?.performerId}`);
      // eslint-disable-next-line no-param-reassign
      report.sourceInfo = (user && new UserDto(user)) || null;
      // eslint-disable-next-line no-param-reassign
      report.performerInfo = (performer && new PerformerDto(performer)) || null;
    });
    return {
      data: reports,
      total
    };
  }
}
