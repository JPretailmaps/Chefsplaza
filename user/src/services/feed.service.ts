import { APIRequest } from './api-request';

export class FeedService extends APIRequest {
  // performer
  uploadAudio(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/performer/feeds/audio/upload',
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

  uploadPhoto(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/performer/feeds/photo/upload',
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

  uploadThumbnail(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/performer/feeds/thumbnail/upload',
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
      '/performer/feeds/video/upload',
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

  uploadTeaser(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/performer/feeds/teaser/upload',
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

  create(data) {
    return this.post('/performer/feeds', data);
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/performer/feeds', query)
    );
  }

  performerSearchUrl() {
    return '/performer/feeds';
  }

  update(id: string, payload: any) {
    return this.put(`/performer/feeds/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/performer/feeds/${id}`);
  }

  findById(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performer/feeds/${id}`, headers);
  }

  addPoll(payload) {
    return this.post('/performer/feeds/polls', payload);
  }

  // user

  userSearch(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/user/feeds', query)
    );
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/user/feeds/${id}`, headers);
  }

  votePoll(pollId: string) {
    return this.post(`/user/feeds/vote/${pollId}`);
  }

  getBookmark(payload) {
    return this.get(this.buildUrl('/reactions/feeds/bookmark', payload));
  }
}

export const feedService = new FeedService();
