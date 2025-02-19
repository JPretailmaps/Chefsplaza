import { IPaymentSearch } from 'src/interfaces';
import { APIRequest } from './api-request';

export class PaymentService extends APIRequest {
  search(query: IPaymentSearch) {
    return this.get(this.buildUrl('/payment/transactions/admin/search', query as any));
  }

  searchEndpoint() {
    return '/payment/transactions/admin/search';
  }
}

export const paymentService = new PaymentService();
