import { APIRequest } from './api-request';

export class BannerService extends APIRequest {
  uploadBanner(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/banner/upload',
      [
        {
          fieldname: 'banner',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/banner/search', query));
  }

  searchEndpoint() {
    return '/admin/banner/search';
  }

  findById(id: string) {
    return this.get(`/admin/banner/${id}/view`);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/banner/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/banner/${id}`);
  }
}

export const bannerService = new BannerService();
