import { createReducers } from '@lib/redux';
import { merge } from 'lodash';

import { loadUIValue, updateUIValue } from './actions';

const initialState = {
  siteName: '',
  logo: '',
  menus: [],
  favicon: '/favicon.ico'
};

const uiReducers = [
  {
    on: updateUIValue,
    reducer(state: any, data: any) {
      if (typeof window !== 'undefined') {
        Object.keys(data.payload).forEach(
          (key) => localStorage && localStorage.setItem(key, data.payload[key])
        );
      }
      return {
        ...state,
        ...data.payload
      };
    }
  },
  {
    on: loadUIValue,
    reducer(state: any) {
      const newVal = {};
      if (typeof window !== 'undefined') {
        Object.keys(initialState).forEach((key) => {
          const val = localStorage.getItem(key);
          if (val) {
            newVal[key] = val;
          }
        });
      }
      return {
        ...state,
        ...newVal
      };
    }
  }
];

export default merge({}, createReducers('ui', [uiReducers], initialState));
