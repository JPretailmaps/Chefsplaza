import { APIRequest } from './api-request';

export class ReactionService extends APIRequest {
  create(payload: any) {
    return this.post('/reactions', payload);
  }

  delete(payload: any) {
    return this.del('/reactions', payload);
  }

  getBookmarks(type, query: { [key: string]: any }) {
    return this.get(this.buildUrl(`/reactions/${type}/bookmark`, query));
  }
}

export const reactionService = new ReactionService();
