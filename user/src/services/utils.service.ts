import { ICountry, ILangguges, IPhoneCodes } from 'src/interfaces';

import { APIRequest, IResponse } from './api-request';

export class UtilsService extends APIRequest {
  private _countries = [] as any;

  private _phoneCodes = [] as any;

  private _languages = [] as any;

  private _bodyInfo = null;

  async countriesList(): Promise<ICountry[]> {
    if (this._countries.length) {
      return this._countries;
    }
    const resp = await this.get('/countries/list');
    this._countries = resp.data;
    return resp.data;
  }

  async statesList(countryCode: string) {
    return this.get(`/states/${countryCode}`);
  }

  async citiesList(countryCode: string, state: string) {
    return this.get(`/cities/${countryCode}/${state}`);
  }

  async languagesList(): Promise<IResponse<ILangguges>> {
    if (this._languages.length) {
      return this._languages;
    }
    const resp = await this.get('/languages/list');
    this._languages = resp.data;
    return resp.data;
  }

  async phoneCodesList(): Promise<IResponse<IPhoneCodes>> {
    if (this._phoneCodes.length) {
      return this._phoneCodes;
    }
    const resp = await this.get('/phone-codes/list');
    this._phoneCodes = resp.data;
    return resp.data;
  }

  async bodyInfo() {
    if (this._bodyInfo) {
      return this._bodyInfo;
    }
    const resp = await this.get('/user-additional');
    this._bodyInfo = resp.data;
    return resp.data;
  }

  verifyRecaptcha(token: string) {
    return this.post('/re-captcha/verify', { token });
  }
}

export const utilsService = new UtilsService();
