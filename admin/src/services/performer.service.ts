import getConfig from 'next/config';
import md5 from 'md5';
import { APIRequest } from './api-request';

const { publicRuntimeConfig } = getConfig();

export class PerformerService extends APIRequest {
  create(payload: any) {
    if (payload.password) {
      // eslint-disable-next-line no-param-reassign
      payload.password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.post('/admin/performers', payload);
  }

  update(id: string, payload: any) {
    if (payload.password) {
      // eslint-disable-next-line no-param-reassign
      payload.password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(payload.password) : payload.password;
    }
    return this.put(`/admin/performers/${id}`, payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/performers/search', query));
  }

  searchEndpoint() {
    return '/admin/performers/search';
  }

  findById(id: string) {
    return this.get(`/admin/performers/${id}/view`);
  }

  delete(id: string) {
    return this.del(`/admin/performers/${id}/delete`);
  }

  getUploadDocumentUrl() {
    return `${publicRuntimeConfig.API_ENDPOINT}/admin/performers/documents/upload`;
  }

  getAvatarUploadUrl(performerId: string) {
    return `${publicRuntimeConfig.API_ENDPOINT}/admin/performers/${performerId}/avatar/upload`;
  }

  getCoverUploadUrl(performerId: string) {
    return `${publicRuntimeConfig.API_ENDPOINT}/admin/performers/${performerId}/cover/upload`;
  }

  uploadAvatar(file: File, performerId: string) {
    return this.upload(`/admin/performers/${performerId}/avatar/upload`, [
      { file, fieldname: 'avatar' }
    ]);
  }

  uploadCover(file: File, performerId: string) {
    return this.upload(`/admin/performers/${performerId}/cover/upload`, [
      { file, fieldname: 'cover' }
    ]);
  }

  getWelcomeVideoUploadUrl(performerId: string) {
    return `${publicRuntimeConfig.API_ENDPOINT}/admin/performers/${performerId}/welcome-video/upload`;
  }

  updatePaymentGatewaySetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/payment-gateway-settings`, payload);
  }

  updateCommissionSetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/commission-settings`, payload);
  }

  updateBankingSetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/banking-settings`, payload);
  }
}

export const performerService = new PerformerService();
