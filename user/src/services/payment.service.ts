import { APIRequest } from './api-request';

export class PaymentService extends APIRequest {
  subscribePerformer(payload: any) {
    return this.post('/payment/subscribe/performers', payload);
  }

  userSearch(payload) {
    return this.get(this.buildUrl('/payment/transactions/user/search', payload));
  }

  addFunds(payload: any) {
    return this.post('/payment/wallet/top-up', payload);
  }

  applyCoupon(code: any) {
    return this.post(`/coupons/${code}/apply-coupon`);
  }

  connectStripeAccount() {
    return this.post('/stripe/accounts');
  }

  getCards(req: any) {
    return this.get(this.buildUrl('/payment-cards', req));
  }

  addCard(gateway: string, payload: any) {
    return this.post(`/${gateway}/cards`, payload);
  }

  removeCard(id: string) {
    return this.del(`/payment-cards/${id}`);
  }
}

export const paymentService = new PaymentService();
