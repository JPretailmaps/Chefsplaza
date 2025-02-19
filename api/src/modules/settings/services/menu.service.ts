import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { PageableData } from 'src/kernel';
import { MENU_PROVIDER } from '../providers';
import { MenuModel } from '../models';
import { MenuDto } from '../dtos';
import { MenuCreatePayload, MenuSearchRequestPayload, MenuUpdatePayload } from '../payloads';

@Injectable()
export class MenuService {
  constructor(
    @Inject(MENU_PROVIDER)
    private readonly menuModel: Model<MenuModel>
  ) {}

  public async checkOrdering(ordering: number, id?: string | Types.ObjectId) {
    const query = { ordering } as any;
    if (id) {
      query._id = { $ne: id };
    }
    const count = await this.menuModel.countDocuments(query);
    if (!count) {
      return ordering;
    }
    return this.checkOrdering(ordering + 1, id);
  }

  public async findById(id: string | Types.ObjectId): Promise<MenuModel> {
    const query = { _id: id };
    const menu = await this.menuModel.findOne(query);
    if (!menu) return null;
    return menu;
  }

  public async create(payload: MenuCreatePayload): Promise<MenuDto> {
    const data = {
      ...payload,
      updatedAt: new Date(),
      createdAt: new Date()
    };
    data.ordering = await this.checkOrdering(payload.ordering || 0);
    const menu = await this.menuModel.create(data);
    return new MenuDto(menu);
  }

  public async update(
    id: string | Types.ObjectId,
    payload: MenuUpdatePayload
  ): Promise<any> {
    const menu = await this.findById(id);
    if (!menu) {
      throw new NotFoundException();
    }

    const data = {
      ...payload,
      updatedAt: new Date()
    } as any;
    data.ordering = await this.checkOrdering(payload.ordering || 0, menu._id);
    await this.menuModel.updateOne({ _id: id }, data);
    return { updated: true };
  }

  public async delete(id: string | Types.ObjectId | MenuModel): Promise<boolean> {
    const menu = id instanceof MenuModel ? id : await this.findById(id);
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    await this.menuModel.deleteOne({ _id: id });
    return true;
  }

  // TODO - define category DTO
  public async search(
    req: MenuSearchRequestPayload
  ): Promise<PageableData<MenuDto>> {
    const query = {} as any;
    if (req.q) {
      query.$or = [
        {
          title: { $regex: req.q }
        }
      ];
    }
    if (req.section) {
      query.section = req.section;
    }
    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy || 'ordering']: req.sort || 1
      };
    }
    const [data, total] = await Promise.all([
      this.menuModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.menuModel.countDocuments(query)
    ]);

    return {
      data: data.map((item) => new MenuDto(item)), // TODO - define mdoel
      total
    };
  }

  public async userSearch(
    req: MenuSearchRequestPayload
  ): Promise<PageableData<MenuDto>> {
    const query = {} as any;
    query.public = true;
    if (req.section) {
      query.section = req.section;
    }
    let sort = {};
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy || 'ordering']: req.sort || 1
      };
    }
    const [data, total] = await Promise.all([
      this.menuModel
        .find(query)
        .sort(sort)
        .limit(req.limit)
        .skip(req.offset),
      this.menuModel.countDocuments(query)
    ]);

    return {
      data: data.map((item) => new MenuDto(item)), // TODO - define mdoel
      total
    };
  }

  public async getPublicMenus() {
    return this.menuModel.find({}).sort({ ordering: 1 });
  }
}
