import { IPerformer } from 'src/interfaces';
import md5 from 'md5';
import getConfig from 'next/config';
import { APIRequest, IResponse } from './api-request';

const { publicRuntimeConfig } = getConfig();

export class PerformerService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/user/search', query));
  }

  searchUrl() {
    return '/performers/user/search';
  }

  randomSearch(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/search/random', query));
  }

  randomSearchUrl() {
    return '/performers/search/random';
  }

  me(headers?: { [key: string]: string }): Promise<IResponse<IPerformer>> {
    return this.get('/performers/me', headers);
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performers/${id}`, headers);
  }

  getAvatarUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/avatar/upload', endpoint).href;
  }

  getCoverUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/cover/upload', endpoint).href;
  }

  getVideoUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/welcome-video/upload', endpoint).href;
  }

  getDocumentUploadUrl() {
    const endpoint = this.getBaseApiEndpoint();
    return new URL('/performers/documents/upload', endpoint).href;
  }

  updateMe(id: string, payload: any) {
    let password: '';
    if (payload.password) {
      password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.put(`/performers/${id}`, { ...payload, password });
  }

  getTopPerformer(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/top', query));
  }

  updateBanking(id: string, payload) {
    return this.put(`/performers/${id}/banking-settings`, payload);
  }

  updatePaymentGateway(id, payload) {
    return this.put(`/performers/${id}/payment-gateway-settings`, payload);
  }

  getBookmarked(payload) {
    return this.get(this.buildUrl('/reactions/performers/bookmark', payload));
  }

  uploadDocuments(documents: {
    file: File;
    fieldname: string;
  }[], onProgress?: Function) {
    return this.upload('/performers/documents/upload', documents, {
      onProgress
    });
  }
}

export const performerService = new PerformerService();
