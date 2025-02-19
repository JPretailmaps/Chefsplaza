import { Injectable, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  StringHelper, EntityNotFoundException, QueueEventService, QueueEvent
} from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { EVENT } from 'src/kernel/constants';
import { CategoryModel } from '../models';
import { PERFORMER_CATEGORY_MODEL_PROVIDER } from '../providers';
import { CategoryCreatePayload, CategoryUpdatePayload } from '../payloads';
import { PerformerCategoryDto } from '../dtos';
import { DELETE_CATEGORY_CHANNEL } from '../constants';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(PERFORMER_CATEGORY_MODEL_PROVIDER)
    private readonly categoryModel: Model<CategoryModel>,
    private readonly queueEventService: QueueEventService
  ) {}

  public async find(params: any): Promise<CategoryModel[]> {
    return this.categoryModel.find(params);
  }

  public async findByIdOrSlug(id: string | Types.ObjectId): Promise<CategoryModel> {
    const query = id instanceof Types.ObjectId || StringHelper.isObjectId(id)
      ? { _id: id }
      : { slug: id };
    const data = await this.categoryModel.findOne(query as any);
    return data;
  }

  public async generateSlug(name: string, id?: string | Types.ObjectId) {
    // consider if need unique slug with type
    const slug = StringHelper.createAlias(name);
    const query = { slug } as any;
    if (id) {
      query._id = { $ne: id };
    }
    const count = await this.categoryModel.countDocuments(query);
    if (!count) {
      return slug;
    }

    return this.generateSlug(`${slug}1`, id);
  }

  public async create(
    payload: CategoryCreatePayload,
    user?: UserDto
  ): Promise<PerformerCategoryDto> {
    const data = {
      ...payload,
      updatedAt: new Date(),
      createdAt: new Date()
    } as any;
    if (user) {
      data.createdBy = user._id;
      data.updatedBy = user._id;
    }

    data.slug = await this.generateSlug(payload.slug || payload.name);

    const category = await this.categoryModel.create(data);
    // TODO - fire event?
    return new PerformerCategoryDto(category);
  }

  public async update(
    id: string | Types.ObjectId,
    payload: CategoryUpdatePayload,
    user?: UserDto
  ): Promise<PerformerCategoryDto> {
    const category = await this.findByIdOrSlug(id);
    if (!category) {
      throw new EntityNotFoundException();
    }

    category.name = payload.name;
    category.ordering = payload.ordering;
    category.description = payload.description;
    if (user) {
      category.updatedBy = user._id;
    }
    await category.save();
    // TODO - emit event for category update
    return new PerformerCategoryDto(category);
  }

  public async delete(id: string | Types.ObjectId | CategoryModel): Promise<void> {
    const category = id instanceof CategoryModel ? id : await this.findByIdOrSlug(id);
    if (!category) {
      // should log?
      throw new EntityNotFoundException();
    }
    await this.categoryModel.deleteOne({ _id: id });
    await this.queueEventService.publish(new QueueEvent({
      channel: DELETE_CATEGORY_CHANNEL,
      eventName: EVENT.DELETED,
      data: new PerformerCategoryDto(category)
    }));
    // TODO - log user activity
  }
}
