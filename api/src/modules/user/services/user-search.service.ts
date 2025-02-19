import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { UserModel } from '../models';
import { USER_MODEL_PROVIDER } from '../providers';
import { UserDto } from '../dtos';
import { UserSearchRequestPayload } from '../payloads';
import { ROLE_ADMIN, STATUS_ACTIVE } from '../constants';

@Injectable()
export class UserSearchService {
  constructor(
    @Inject(USER_MODEL_PROVIDER)
    private readonly userModel: Model<UserModel>
  ) { }

  // TODO - should create new search service?
  public async search(
    req: UserSearchRequestPayload
  ): Promise<PageableData<UserDto>> {
    const query = {} as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
        'i'
      );
      query.$or = [
        {
          name: { $regex: regexp }
        },
        {
          username: { $regex: regexp }
        }
      ];
    }
    if (req.verifiedEmail) {
      query.verifiedEmail = req.verifiedEmail === 'true';
    }
    if (req.role) {
      query.roles = { $in: [req.role] };
    }
    if (req.status) {
      query.status = req.status;
    }
    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.userModel.countDocuments(query)
    ]);
    return {
      data: data.map((item) => new UserDto(item).toResponse(true)),
      total
    };
  }

  public async performerSearch(
    req: UserSearchRequestPayload
  ): Promise<PageableData<UserDto>> {
    const query = {
      status: STATUS_ACTIVE,
      roles: { $ne: ROLE_ADMIN }
    } as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
        'i'
      );
      query.$or = [
        {
          name: { $regex: regexp }
        },
        {
          username: { $regex: regexp }
        }
      ];
    }
    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    const [data, total] = await Promise.all([
      this.userModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.userModel.countDocuments(query)
    ]);

    const users = data.map((d) => new UserDto(d).toResponse());
    return {
      data: users,
      total
    };
  }

  public async searchByKeyword(
    req: UserSearchRequestPayload
  ): Promise<any> {
    const query = {} as any;
    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''),
        'i'
      );
      query.$or = [
        {
          name: { $regex: regexp }
        },
        {
          username: { $regex: regexp }
        }
      ];
    }
    const [data] = await Promise.all([
      this.userModel
        .find(query)
    ]);
    return data;
  }
}
