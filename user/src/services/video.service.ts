import { APIRequest } from './api-request';

export class VideoService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/performer/performer-assets/videos/search', query)
    );
  }

  performerSearchUrl() {
    return '/performer/performer-assets/videos/search';
  }

  userSearch(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/performer-assets/videos/search', query)
    );
  }

  delete(id: string) {
    return this.del(`/performer/performer-assets/videos/${id}`);
  }

  findById(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performer/performer-assets/videos/${id}/view`, headers);
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performer-assets/videos/${id}`, headers);
  }

  update(id: string, files: [{ fieldname: string; file: File }], payload: any, onProgress?: Function) {
    return this.upload(`/performer/performer-assets/videos/edit/${id}`, files, {
      onProgress,
      customData: payload,
      method: 'PUT'
    });
  }

  deleteFile(id: string, type: string) {
    return this.del(`/performer/performer-assets/videos/remove-file/${id}`, { type });
  }

  uploadVideo(
    files: [{ fieldname: string; file: File }],
    payload: any,
    onProgress?: Function,
    pauseButton = null
  ) {
    return this.upload('/performer/performer-assets/videos/upload', files, {
      onProgress,
      customData: payload
    }, pauseButton);
  }

  getBookmarks(payload) {
    return this.get(this.buildUrl('/reactions/videos/bookmark', payload));
  }
}

export const videoService = new VideoService();
