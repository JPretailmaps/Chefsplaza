import { APIRequest } from './api-request';

class PayoutRequestService extends APIRequest {
  calculate() {
    return this.post('/payout-requests/calculate');
  }

  search(query: { [key: string]: any }) {
    return this.get(this.buildUrl('/payout-requests/search', query));
  }

  performerSearchUrl() {
    return '/payout-requests/search';
  }

  create(body: any) {
    return this.post('/payout-requests', body);
  }

  update(id: string, body: any) {
    return this.put(`/payout-requests/${id}`, body);
  }

  detail(
    id: string,
    headers: {
      [key: string]: string;
    }
  ): Promise<any> {
    return this.get(`/payout-requests/${id}/view`, headers);
  }

  checkPending(
    headers: {
      [key: string]: string;
    }
  ): Promise<any> {
    return this.get('/payout-requests/check/pending-review', headers);
  }
}

export const payoutRequestService = new PayoutRequestService();
