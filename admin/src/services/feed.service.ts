import { APIRequest } from './api-request';

export class FeedService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/feeds', query)
    );
  }

  searchEndpoint() {
    return '/admin/feeds';
  }

  delete(id: string) {
    return this.del(`/admin/feeds/${id}`);
  }

  findById(id: string, headers?: { [key: string]: string }) {
    return this.get(`/admin/feeds/${id}`, headers);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/feeds/${id}`, payload);
  }

  create(data) {
    return this.post('/admin/feeds', data);
  }

  uploadPhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/feeds/photo/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadVideo(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/feeds/video/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadThumbnail(file: any, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/feeds/thumbnail/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadTeaser(file: any, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/feeds/teaser/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  uploadAudio(file: any, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/feeds/audio/upload',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress,
        customData: payload
      }
    );
  }

  addPoll(payload) {
    return this.post('/admin/feeds/polls', payload);
  }
}

export const feedService = new FeedService();
