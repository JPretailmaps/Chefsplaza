import { createReducers } from '@lib/redux';
import { merge } from 'lodash';
import { IReduxAction } from 'src/interfaces';

import { accessPrivateRequest, addPrivateRequest } from './actions';

const initialState = {
  privateRequests: []
};

const reducers = [
  {
    on: addPrivateRequest,
    reducer(state: any, action: IReduxAction<any>) {
      return {
        ...state,
        privateRequests: [...state.privateRequests, action.payload]
      };
    }
  },
  {
    on: accessPrivateRequest,
    reducer(state: any, action: IReduxAction<string>) {
      return {
        ...state,
        privateRequests: state.privateRequests.filter((p) => p.conversationId !== action.payload)
      };
    }
  }
];
export default merge({}, createReducers('streaming', [reducers], initialState));
