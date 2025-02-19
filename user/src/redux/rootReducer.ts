import { merge } from 'lodash';
import { combineReducers } from 'redux';

import auth from './auth/reducers';
import message from './message/reducers';
// load reducer here
import settings from './settings/reducers';
import conversation from './stream-chat/reducers';
import streaming from './streaming/reducers';
import subscription from './subscription/reducers';
import ui from './ui/reducers';
import user from './user/reducers';
import follow from './follow/reducers';

const reducers = merge(
  settings,
  ui,
  user,
  auth,
  message,
  streaming,
  conversation,
  subscription,
  follow
);

export default combineReducers(reducers);
