import { APIRequest } from './api-request';

export class OrderService extends APIRequest {
  search(payload) {
    return this.get(this.buildUrl('/orders/search', payload));
  }

  searchEndpoint() {
    return '/orders/search';
  }

  findById(id: string, headers?: any) {
    return this.get(`/orders/${id}`, headers);
  }

  update(id, data) {
    return this.put(`/orders/${id}/update`, data);
  }
}

export const orderService = new OrderService();
