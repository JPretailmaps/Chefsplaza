import { createAction, createAsyncAction } from '@lib/redux';

export const { login, loginSuccess, loginFail } = createAsyncAction(
  'login',
  'LOGIN'
);

export const { loginPerformer } = createAsyncAction(
  'loginPerformer',
  'LOGINPERFORMER'
);

export const { loginSocial } = createAsyncAction(
  'loginSocial',
  'LOGINSOCIAL'
);

export const logout = createAction('logout');

export const getCurrentUser = createAction('getCurrentUser');
