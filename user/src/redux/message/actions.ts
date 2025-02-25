import { createAction, createAsyncAction } from '@lib/redux';

export const {
  getConversations,
  getConversationsSuccess,
  getConversationsFail
} = createAsyncAction('getConversations', 'LOAD_CONVERSATIONS');

export const {
  readMessages
} = createAsyncAction('readMessages', 'READ_MESSAGES');

export const {
  sendMessage,
  sendMessageSuccess,
  sendMessageFail
} = createAsyncAction('sendMessage', 'SEND_MESSAGE');

export const {
  deletePrivateMessage,
  deletePrivateMessageSuccess,
  deletePrivateMessageFail
} = createAsyncAction('deletePrivateMessage', 'DELETE_PRIVATE_MESSAGE');

export const {
  deactiveConversation
} = createAsyncAction('deactiveConversation', 'DEACTIVE_CONVERSATION');

export const {
  setActiveConversation,
  setActiveConversationSuccess,
  setActiveConversationFail
} = createAsyncAction(
  'setActiveConversation',
  'SET_ACTIVE_CONVERSATION_RECEIVER'
);

export const {
  loadMessages,
  loadMessagesSuccess,
  loadMessagesFail
} = createAsyncAction('loadMessages', 'LOAD_MESSAGES');

export const {
  loadMoreMessages,
  loadMoreMessagesSuccess,
  loadMoreMessagesFail
} = createAsyncAction('loadMoreMessages', 'LOAD_MORE_MESSAGES');

export const fetchingMessage = createAction('fetchingMessage');

export const resetMessageState = createAction('resetMessageState');

export const deleteMessageSuccess = createAction('deleteMessageSuccess');

export const {
  getConversationDetail,
  getConversationDetailSuccess,
  getConversationDetailFail
} = createAsyncAction('getConversationDetail', 'LOAD_CONVERSATION_ITEM');
