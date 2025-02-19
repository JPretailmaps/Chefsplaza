import { APIRequest } from './api-request';

export class EarningService extends APIRequest {
  performerStats(param?: any) {
    return this.get(this.buildUrl('/performer/earning/stats', param));
  }

  performerSearch(param?: any) {
    return this.get(this.buildUrl('/performer/earning/search', param));
  }

  performerSearchUrl() {
    return '/performer/earning/search';
  }

  performerStatsUrl() {
    return '/performer/earning/stats';
  }
}

export const earningService = new EarningService();
