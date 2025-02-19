import { APIRequest } from './api-request';

class GalleryService extends APIRequest {
  create(payload) {
    return this.post('/performer/performer-assets/galleries', payload);
  }

  search(param?: any) {
    return this.get(this.buildUrl('/performer/performer-assets/galleries/search', param));
  }

  performerSearchUrl() {
    return '/performer/performer-assets/galleries/search';
  }

  userSearch(param: any, headers?: any) {
    return this.get(this.buildUrl('/performer-assets/galleries/search', param), headers);
  }

  update(id: string, payload) {
    return this.put(`/performer/performer-assets/galleries/${id}`, payload);
  }

  findById(id: string, headers?: any) {
    return this.get(`/performer/performer-assets/galleries/${id}/view`, headers);
  }

  userViewDetails(id: string, headers?: any) {
    return this.get(`/performer-assets/galleries/${id}/view`, headers);
  }

  delete(id: string) {
    return this.del(`/performer/performer-assets/galleries/${id}`);
  }

  getBookmarks(payload) {
    return this.get(this.buildUrl('/reactions/galleries/bookmark', payload));
  }
}

export const galleryService = new GalleryService();
