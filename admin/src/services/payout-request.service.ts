import { APIRequest } from './api-request';

export class PayoutRequestService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/payout-requests/search', query)
    );
  }

  searchEndpoint() {
    return '/admin/payout-requests/search';
  }

  update(id: string, payload: any) {
    return this.post(`/admin/payout-requests/status/${id}`, payload);
  }

  calculate(payload: any) {
    return this.post('/admin/payout-requests/calculate', payload);
  }

  payout(id: string) {
    return this.post(`/admin/payout-requests/payout/${id}`);
  }

  findById(id: string, headers?: any) {
    return this.get(`/admin/payout-requests/${id}`, headers);
  }

  delete(id: string) {
    return this.del(`/admin/payout-requests/${id}`);
  }
}

export const payoutRequestService = new PayoutRequestService();
