import { APIRequest } from './api-request';

export class BannerService extends APIRequest {
  search(query: any) {
    return this.get(this.buildUrl('/site-promo/search', query));
  }
}

export const bannerService = new BannerService();
