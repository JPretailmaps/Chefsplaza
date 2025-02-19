import {
  IPerformerCategoryCreate,
  IPerformerCategoryUpdate
} from '@interfaces/performer-category';
import { APIRequest } from './api-request';

export class PerformerCategoryService extends APIRequest {
  create(payload: IPerformerCategoryCreate) {
    return this.post('/admin/performer-categories', payload);
  }

  search(query?: any) {
    return this.get(
      this.buildUrl('/admin/performer-categories/search', query)
    );
  }

  findById(id: string) {
    return this.get(`/admin/performer-categories/${id}/view`);
  }

  update(id: string, payload: IPerformerCategoryUpdate) {
    return this.put(`/admin/performer-categories/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/performer-categories/${id}`);
  }
}

export const performerCategoryService = new PerformerCategoryService();
