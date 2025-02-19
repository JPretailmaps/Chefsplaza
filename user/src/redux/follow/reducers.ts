import { createReducers } from '@lib/redux';
import { IReduxAction } from 'src/interfaces';
import { uniq } from 'lodash';
import {
  addFollowId, removeFollowId
} from './actions';

const merge = require('lodash/merge');

const initialState = {
  followedIds: []
};

const followReducers = [
  {
    on: addFollowId,
    reducer(state: any, data: IReduxAction<any>) {
      if (state.followedIds.includes(data.payload)) return state;
      return {
        followedIds: uniq([...state.followedIds, ...[data.payload]])
      };
    }
  },
  {
    on: removeFollowId,
    reducer(state: any, data: IReduxAction<any>) {
      return {
        followedIds: uniq(state.followedIds.filter((id) => id !== data.payload))
      };
    }
  }
];

export default merge({}, createReducers('follow', [followReducers], initialState));
