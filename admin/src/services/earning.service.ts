import { IEarningSearch, IUpdatePaidStatus } from 'src/interfaces';
import { APIRequest } from './api-request';

export class EarningService extends APIRequest {
  search(query: IEarningSearch) {
    return this.get(this.buildUrl('/admin/earning/search', query as any));
  }

  searchEndpoint() {
    return '/admin/earning/search';
  }

  stats(query: IEarningSearch) {
    return this.get(this.buildUrl('/admin/earning/stats', query as any));
  }

  statsEndpoint() {
    return '/admin/earning/stats';
  }

  updatePaidStatus(data: IUpdatePaidStatus) {
    return this.post('/admin/earning/update-status', data);
  }

  findById(id: string) {
    return this.get(`/admin/earning/${id}`);
  }
}

export const earningService = new EarningService();
