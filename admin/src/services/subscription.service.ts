import { APIRequest } from './api-request';

class SubscriptionService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/subscriptions/admin/search', query));
  }

  searchEndpoint() {
    return '/subscriptions/admin/search';
  }

  create(payload: any) {
    return this.post('/subscriptions', payload);
  }

  update(id: string, payload: any) {
    return this.put(`/subscriptions/admin/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/subscriptions/admin/${id}`);
  }

  cancelSubscription(id: string, gateway: string) {
    return this.post(`/payment/${gateway}/cancel-subscription/${id}`);
  }
}
export const subscriptionService = new SubscriptionService();
