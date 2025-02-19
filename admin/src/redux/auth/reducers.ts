import { merge } from 'lodash';
import { createReducers } from '@lib/redux';
import {
  login, loginSuccess, loginFail, logoutSuccess
} from './actions';

const initialState = {
  loggedIn: false,
  loginAuth: {
    requesting: false,
    error: null,
    data: null,
    success: false
  }
};

const authReducers = [
  {
    on: login,
    reducer(state: any) {
      return {
        ...state,
        loginAuth: {
          requesting: false,
          error: null
        }
      };
    }
  },
  {
    on: loginSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: true,
        loginAuth: {
          requesting: false,
          error: null,
          data: data.payload,
          success: true
        }
      };
    }
  },
  {
    on: loginFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        loggedIn: false,
        loginAuth: {
          requesting: false,
          error: data.payload,
          success: false
        }
      };
    }
  },
  {
    on: logoutSuccess,
    reducer(state: any) {
      return {
        ...state,
        loginAuth: {
          success: false,
          error: null
        },
        loggedIn: false
      };
    }
  }
];

export default merge({}, createReducers('auth', [authReducers], initialState));
