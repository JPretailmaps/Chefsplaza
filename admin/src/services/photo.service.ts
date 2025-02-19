import { APIRequest } from './api-request';

export class PhotoService extends APIRequest {
  uploadPhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/performer-assets/photos/upload',
      [
        {
          fieldname: 'photo',
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
    return this.get(
      this.buildUrl('/admin/performer-assets/photos/search', query)
    );
  }

  searchEndpoint() {
    return '/admin/performer-assets/photos/search';
  }

  findById(id: string, headers?: any) {
    return this.get(`/admin/performer-assets/photos/${id}/view`, headers);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/performer-assets/photos/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/performer-assets/photos/${id}`);
  }
}

export const photoService = new PhotoService();
