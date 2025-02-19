import { ISetting } from 'src/interfaces';
import getConfig from 'next/config';
import { APIRequest, IResponse } from './api-request';

export class SettingService extends APIRequest {
  public() {
    return this.get(this.buildUrl('/settings/public')).then((resp) => resp.data);
  }

  valueByKeys(keys: string[]): Promise<Record<string, any>> {
    return this.post('/settings/keys', { keys }).then((resp) => resp.data);
  }

  all(group = ''): Promise<IResponse<ISetting>> {
    return this.get(this.buildUrl('/admin/settings', { group }));
  }

  update(key: string, value: any) {
    return this.put(`/admin/settings/${key}`, { value });
  }

  getFileUploadUrl() {
    const { publicRuntimeConfig: config } = getConfig();
    return `${config.API_ENDPOINT}/admin/settings/files/upload`;
  }

  verifyMailer() {
    return this.post('/mailer/verify');
  }
}

export const settingService = new SettingService();
