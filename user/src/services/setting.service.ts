import { APIRequest } from './api-request';

export class SettingService extends APIRequest {
  all() {
    return this.get(this.buildUrl('/settings/public')).then((resp) => resp.data);
  }

  contact(data) {
    return this.post('/contact', data);
  }

  valueByKeys(keys: string[]): Promise<Record<string, any>> {
    return this.post('/settings/keys', { keys }).then((resp) => resp.data);
  }
}

export const settingService = new SettingService();
