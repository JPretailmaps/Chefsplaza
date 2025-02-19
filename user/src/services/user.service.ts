import md5 from 'md5';
import getConfig from 'next/config';
import { APIRequest } from './api-request';

const { publicRuntimeConfig } = getConfig();

export class UserService extends APIRequest {
  me(headers?: { [key: string]: string }): Promise<any> {
    return this.get('/users/me', headers);
  }

  updateMe(payload: any) {
    let password: '';
    if (payload.password) {
      password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.put('/users', { ...payload, password });
  }

  getAvatarUploadUrl(userId?: string) {
    const endpoint = this.getBaseApiEndpoint();
    if (userId) {
      return new URL(`/users/${userId}/avatar/upload`, endpoint).href;
    }
    return new URL('/users/avatar/upload', endpoint).href;
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/users/search', query));
  }

  findById(id: string) {
    return this.get(`/users/view/${id}`);
  }
}

export const userService = new UserService();
