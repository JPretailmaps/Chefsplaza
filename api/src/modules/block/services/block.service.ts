import { Injectable, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { EntityNotFoundException } from 'src/kernel';
import { PerformerBlockUserModel, SiteBlockCountryModel } from '../models';
import { PERFORMER_BLOCK_USER_PROVIDER, SITE_BLOCK_COUNTRY_PROVIDER } from '../providers';
import {
  BlockCountryCreatePayload
} from '../payloads';

@Injectable()
export class BlockService {
  constructor(
    @Inject(SITE_BLOCK_COUNTRY_PROVIDER)
    private readonly blockCountryModel: Model<SiteBlockCountryModel>,
    @Inject(PERFORMER_BLOCK_USER_PROVIDER)
    private readonly blockedByPerformerModel: Model<PerformerBlockUserModel>
  ) {}

  public async create(payload: BlockCountryCreatePayload): Promise<any> {
    const country = await this.blockCountryModel.findOne({ countryCode: payload.countryCode });
    if (country) {
      return 'ALREADY_BLOCKED';
    }
    return this.blockCountryModel.create({
      countryCode: payload.countryCode,
      createdAt: new Date()
    });
  }

  public async search(): Promise<any> {
    return this.blockCountryModel.find({});
  }

  public async delete(code): Promise<any> {
    const country = await this.blockCountryModel.findOne({ countryCode: code });
    if (!country) {
      throw new EntityNotFoundException();
    }
    await this.blockCountryModel.deleteOne({ _id: country._id });
    return true;
  }

  public async checkCountryBlock(countryCode) {
    const country = await this.blockCountryModel.countDocuments({ countryCode });

    return { blocked: country > 0 };
  }

  public async userSearch(userId: Types.ObjectId) {
    const blocks = await this.blockedByPerformerModel.find({ targetId: userId });

    return blocks;
  }
}
