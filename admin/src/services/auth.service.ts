import cookie from 'js-cookie';
import md5 from 'md5';
import { ILogin } from 'src/interfaces';
import getConfig from 'next/config';
import { APIRequest, TOKEN } from './api-request';

const { publicRuntimeConfig } = getConfig();

export class AuthService extends APIRequest {
  public async login(data: ILogin) {
    // hashm5 password
    const password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(data.password) : data.password;

    return this.post('/auth/login', {
      ...data,
      password
    });
  }

  setToken(token: string): void {
    // https://github.com/js-cookie/js-cookie
    // since Safari does not support, need a better solution
    cookie.set(TOKEN, token);
  }

  getToken(): string {
    const token = cookie.get(TOKEN);
    return token;
  }

  removeToken(): void {
    cookie.remove(TOKEN);
  }

  updatePassword(pw: string, userId?: string, source = 'user') {
    // hashm5 password
    const password = publicRuntimeConfig.HASH_PW_CLIENT === 'true' ? md5(pw) : pw;
    const url = userId ? '/admin/auth/users/password' : '/auth/users/me/password';
    return this.put(url, { userId, password, source });
  }

  resetPassword(data) {
    return this.post('/auth/users/forgot', data);
  }
}

export const authService = new AuthService();
