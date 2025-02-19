import { all, spawn } from 'redux-saga/effects';

import authSagas from './auth/sagas';
import messageSagas from './message/sagas';
import streamChatSagas from './stream-chat/sagas';
import userSagas from './user/sagas';

function* rootSaga() {
  yield all(
    [
      ...authSagas,
      ...userSagas,
      ...messageSagas,
      ...streamChatSagas
    ].map(spawn)
  );
}

export default rootSaga;
