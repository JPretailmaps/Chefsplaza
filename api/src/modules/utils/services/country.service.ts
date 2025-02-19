import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { COUNTRIES } from '../constants';

@Injectable()
export class CountryService {
  constructor() {}

  private countryList;

  public getList() {
    if (this.countryList) {
      return this.countryList;
    }

    this.countryList = COUNTRIES.map((c) => ({
      name: c.name,
      code: c.code,
      flag: c.flag
    }));
    return this.countryList;
  }

  public async findCountryByIP(ip: string): Promise<AxiosResponse<any>> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      return response.data;
    } catch (e) {
      // const error = e.then(resp => resp);;
      return null;
    }
  }
}
