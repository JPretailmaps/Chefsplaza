import { createSagas } from '@lib/redux';
import { message } from 'antd';
import { flatten } from 'lodash';
import Router from 'next/router';
import { put } from 'redux-saga/effects';
import {
  ILogin
} from 'src/interfaces';
import { authService, userService } from 'src/services';

import { updateCurrentUser } from '../user/actions';
import {
  getCurrentUser,
  login,
  loginFail,
  loginSocial,
  loginSuccess,
  logout
} from './actions';

const authSagas = [
  {
    on: login,
    * worker(data: any) {
      try {
        const payload = data.payload as ILogin;
        const resp = (yield authService.login(payload)).data;
        // store token, update store and redirect to dashboard page
        yield authService.setToken(resp.token, payload?.remember);
        const userResp = yield userService.me();
        yield put(updateCurrentUser(userResp.data));
        yield put(loginSuccess());
        if (!userResp?.data?.isPerformer) {
          Router.push((!userResp.data.email || !userResp.data.username) ? '/user/account' : '/home');
        }
        if (userResp?.data?.isPerformer) {
          (!userResp.data.email || !userResp.data.username) ? Router.push('/creator/account') : Router.push({ pathname: '/[profileId]', query: { profileId: userResp.data.username || userResp.data._id } }, `/${userResp.data.username || userResp.data._id}`);
        }
      } catch (e) {
        const error = yield Promise.resolve(e);
        message.error(error?.message || 'Incorrect credentials!');
        yield put(loginFail(error));
      }
    }
  },
  {
    on: loginSocial,
    * worker(data: any) {
      try {
        const payload = data.payload as any;
        const { token } = payload;
        yield authService.setToken(token);
        const userResp = yield userService.me();
        yield put(updateCurrentUser(userResp.data));
        yield put(loginSuccess());
        if (!userResp?.data?.isPerformer) {
          Router.push((!userResp.data.email || !userResp.data.username) ? '/user/account' : '/home');
        }
        if (userResp?.data?.isPerformer) {
          (!userResp.data.email || !userResp.data.username) ? Router.push('/creator/account') : Router.push({ pathname: '/[profileId]', query: { profileId: userResp.data.username || userResp.data._id } }, `/${userResp.data.username || userResp.data._id}`);
        }
      } catch (e) {
        const error = yield Promise.resolve(e);
        message.error(error?.message || 'Incorrect credentials!');
        yield put(loginFail(error));
      }
    }
  },
  {
    on: logout,
    * worker() {
      yield authService.removeToken();
      Router.replace({
        pathname: '/auth/login',
        href: '/'
      });
    }
  },
  {
    on: getCurrentUser,
    * worker() {
      try {
        const userResp = yield userService.me();
        yield put(updateCurrentUser(userResp.data));
      } catch (e) {
        const error = yield Promise.resolve(e);
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }
];

export default flatten([createSagas(authSagas)]);
