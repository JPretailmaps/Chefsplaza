import { APIRequest } from './api-request';

export class TokenTransctionService extends APIRequest {
  sendTip(performerId: string, payload: any) {
    return this.post(`/wallet/charges/tip/${performerId}`, payload);
  }

  purchaseFeed(id, payload) {
    return this.post(`/wallet/charges/feed/${id}`, payload);
  }

  purchaseProduct(id, payload) {
    return this.post(`/wallet/charges/product/${id}`, payload);
  }

  purchaseVideo(id, payload) {
    return this.post(`/wallet/charges/video/${id}`, payload);
  }

  purchaseGallery(id, payload = {}) {
    return this.post(`/wallet/charges/gallery/${id}`, payload);
  }

  purchaseMessage(id, payload) {
    return this.post(`/wallet/charges/message/${id}`, payload);
  }

  purchaseStream(id) {
    return this.post(`/wallet/charges/stream/${id}`);
  }

  userSearch(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/wallet/charges/search', query));
  }
}

export const tokenTransctionService = new TokenTransctionService();
