import { IUser } from 'src/interfaces';
import getConfig from 'next/config';
import md5 from 'md5';
import { APIRequest, IResponse } from './api-request';

const { publicRuntimeConfig } = getConfig();

export class UserService extends APIRequest {
  me(headers?: { [key: string]: string }): Promise<IResponse<IUser>> {
    return this.get('/users/me', headers);
  }

  updateMe(payload: any) {
    if (payload.password) {
      // eslint-disable-next-line no-param-reassign
      payload.password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.put('/users', payload);
  }

  create(payload: any) {
    if (payload.password) {
      // eslint-disable-next-line no-param-reassign
      payload.password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.post('/admin/users', payload);
  }

  update(id: string, payload: any) {
    if (payload.password) {
      // eslint-disable-next-line no-param-reassign
      payload.password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.put(`/admin/users/${id}`, payload);
  }

  getAvatarUploadUrl(userId?: string) {
    if (userId) {
      return `${publicRuntimeConfig.API_ENDPOINT}/admin/users/${userId}/avatar/upload`;
    }
    return `${publicRuntimeConfig.API_ENDPOINT}/users/avatar/upload`;
  }

  uploadAvatarUser(file: File, userId?: string) {
    return this.upload(`/admin/users/${userId}/avatar/upload`, [
      { file, fieldname: 'avatar' }
    ]);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/users/search', query));
  }

  searchEndpoint() {
    return '/admin/users/search';
  }

  findById(id: string) {
    return this.get(`/admin/users/${id}/view`);
  }

  delete(id: string) {
    return this.del(`/admin/users/${id}/delete`);
  }
}

export const userService = new UserService();
