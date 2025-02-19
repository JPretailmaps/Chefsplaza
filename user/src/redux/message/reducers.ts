import { createReducers } from '@lib/redux';
import {
  findIndex, merge, uniq, uniqBy
} from 'lodash';
import { IMessage, IReduxAction } from 'src/interfaces';

import {
  deactiveConversation,
  deletePrivateMessage,
  deletePrivateMessageFail,
  deletePrivateMessageSuccess,
  deleteMessageSuccess,
  fetchingMessage,
  getConversationDetailSuccess,
  getConversations,
  getConversationsFail,
  getConversationsSuccess,
  loadMessagesSuccess,
  loadMoreMessagesSuccess,
  readMessages,
  resetMessageState,
  sendMessage,
  sendMessageFail,
  sendMessageSuccess,
  setActiveConversationSuccess
} from './actions';

const initialConversationState = {
  list: {
    requesting: false,
    error: null,
    data: [],
    total: 0,
    success: false
  },
  mapping: {},
  activeConversation: {}
};

const initialMessageState = {
  // conversationId => { fetching: boolean, items: [] }
  conversationMap: {},
  sendMessage: {},
  deleteMessage: {},
  receiveMessage: {}
};

const conversationReducer = [
  {
    on: resetMessageState,
    reducer(state: any) {
      let { list, mapping, activeConversation } = state;
      list = {
        requesting: false,
        error: null,
        data: [],
        total: 0,
        success: false
      };
      mapping = {};
      activeConversation = {};
      return {
        ...state,
        list,
        mapping,
        activeConversation
      };
    }
  },
  {
    on: getConversations,
    reducer(state: any) {
      const nextState = { ...state };
      nextState.list.requesting = true;
      return {
        ...nextState
      };
    }
  },
  {
    on: getConversationsSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      const { list, mapping } = nextState;
      const { data: items, total, isMore = false } = data.payload;
      const Ids = uniq(items.map((c) => c._id));
      list.data = isMore ? list.data.concat(Ids) : Ids;
      list.total = total;
      list.success = true;
      list.requesting = false;
      list.error = false;
      items.forEach((c) => {
        mapping[c._id] = c;
      });
      return {
        ...nextState
      };
    }
  },
  {
    on: getConversationsFail,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      return {
        ...nextState,
        list: {
          requesting: false,
          error: data.payload,
          data: [],
          total: 0,
          success: false
        },
        mapping: {},
        activeConversation: {}
      };
    }
  },
  {
    on: setActiveConversationSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const conversation = data.payload;
      const list = state.list.data;
      const { mapping } = state;
      const check = list.find((c) => c === conversation._id);
      if (!check) {
        list.unshift(conversation._id);
        mapping[conversation._id] = conversation;
      }
      return {
        ...state,
        activeConversation: conversation
      };
    }
  },
  {
    on: getConversationDetailSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const { list, mapping } = state;
      const conversation = data.payload;
      if (!list.data.includes(conversation._id)) {
        list.data.unshift(conversation._id);
        mapping[conversation._id] = conversation;
      }

      return {
        ...state
      };
    }
  },
  {
    on: readMessages,
    reducer(state: any, data: IReduxAction<any>) {
      const conversationId = data.payload;
      const { mapping } = state;
      mapping[conversationId].totalNotSeenMessages = 0;
      return {
        ...state
      };
    }
  },
  {
    on: deactiveConversation,
    reducer(state: any) {
      const nextState = { ...state };
      nextState.activeConversation = {};
      return {
        ...nextState
      };
    }
  }
];

const messageReducer = [
  {
    on: fetchingMessage,
    reducer(state: any, data: IReduxAction<any>) {
      const { conversationMap } = state;
      const { conversationId } = data.payload;
      conversationMap[conversationId] = {
        ...conversationMap[conversationId],
        fetching: true
      };
      return { ...state };
    }
  },
  {
    on: loadMessagesSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const { conversationMap } = state;
      const { conversationId, items, total } = data.payload;
      conversationMap[conversationId] = {
        items: [...items.reverse()],
        total,
        fetching: false
      };
      return { ...state };
    }
  },
  {
    on: loadMoreMessagesSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const { conversationMap } = state;
      const { conversationId, items, total } = data.payload;
      conversationMap[conversationId] = {
        items: [
          ...items.reverse(),
          ...conversationMap[conversationId].items || []
        ],
        total,
        fetching: false
      };
      return { ...state };
    }
  },
  {
    on: sendMessage,
    reducer(state: any) {
      return {
        ...state,
        sendMessage: {
          sending: true
        }
      };
    }
  },
  {
    on: sendMessageSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      if (!nextState.conversationMap[data.payload.conversationId] || !nextState.conversationMap[data.payload.conversationId].items) {
        nextState.conversationMap[data.payload.conversationId] = {
          items: []
        };
      }

      nextState.conversationMap[data.payload.conversationId].items = uniqBy([...nextState.conversationMap[data.payload.conversationId].items, ...[data.payload]], (m) => m._id);

      return {
        ...nextState,
        sendMessage: {
          sending: false,
          success: true,
          data: data.payload
        }
      };
    }
  },
  {
    on: sendMessageFail,
    reducer(state: any, data: IReduxAction<any>) {
      return {
        ...state,
        sendMessage: {
          sending: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: deletePrivateMessage,
    reducer(state: any) {
      return {
        ...state,
        deleteMessage: {
          deleting: true
        }
      };
    }
  },
  {
    on: deletePrivateMessageSuccess,
    reducer(state: any, data: any) {
      const nextState = { ...state };
      const conversation = nextState.conversationMap[data.payload.conversationId];
      if (conversation && conversation.items) {
        conversation.items.splice(conversation.items.findIndex((i) => i._id === data.payload._id), 1);
      }
      return {
        ...state,
        deleteMessage: {
          deleting: false,
          success: true,
          data: data.payload
        }
      };
    }
  },
  {
    on: deletePrivateMessageFail,
    reducer(state: any, data: any) {
      return {
        ...state,
        deleteMessage: {
          deleting: false,
          success: false,
          error: data.payload
        }
      };
    }
  },
  {
    on: deactiveConversation,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      const conversationId = data.payload;
      if (conversationId && nextState.conversationMap[conversationId]) {
        nextState.conversationMap[conversationId] = {
          items: [],
          total: 0,
          requesting: false
        };
      }
      return {
        ...nextState
      };
    }
  },
  {
    on: deleteMessageSuccess,
    reducer(state: any, data: IReduxAction<any>) {
      const nextState = { ...state };
      const { conversationId, _id } = data.payload as IMessage;
      if (nextState.conversationMap[conversationId] && nextState.conversationMap[conversationId].items) {
        const i = findIndex(nextState.conversationMap[conversationId].items, (item: any) => item && item._id === _id);
        nextState.conversationMap[conversationId].items[i].text = 'Message deleted!';
        nextState.conversationMap[conversationId].items[i].isDeleted = true;
      }
      return {
        ...nextState
      };
    }
  }
];

export default merge(
  {},
  createReducers(
    'conversation',
    [conversationReducer],
    initialConversationState
  ),
  createReducers('message', [messageReducer], initialMessageState)
);
