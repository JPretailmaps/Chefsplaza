import {
  deactiveConversation,
  getConversations,
  setActiveConversation
} from '@redux/message/actions';
import { Spin } from 'antd';
import { debounce } from 'lodash';
import {
  useEffect, useRef
} from 'react';
import { connect } from 'react-redux';
import { MessageIcon } from 'src/icons';
import { IUser } from 'src/interfaces';

import classNames from 'classnames';
import style from './ConversationList.module.scss';
import ConversationListItem from './ConversationListItem';
import ConversationSearch from './ConversationSearch';

interface IProps {
  getConversations: Function;
  setActiveConversation: Function;
  deactiveConversation: Function;
  conversationState: {
    list: {
      requesting: boolean;
      error: any;
      data: any[];
      total: number;
      success: boolean;
    };
    mapping: Record<string, any>;
    activeConversation: Record<string, any>;
  };
  toSource: string;
  toId: string;
  user: IUser;
}

function ConversationList({
  getConversations: getConversationsHandler,
  setActiveConversation: setActiveConversationHandler,
  deactiveConversation: setDeactiveConversationHandler,
  toId,
  toSource,
  user,
  conversationState
}: IProps) {
  const offset = useRef(0);
  const keyword = useRef('');

  useEffect(() => {
    getConversationsHandler({
      limit: 25, offset: 0, type: 'private', keyword: '', isMore: false
    });
    if (toSource && toId) {
      setTimeout(() => {
        setActiveConversationHandler({
          source: toSource,
          sourceId: toId,
          recipientId: user._id
        });
      }, 1000);
    }
  }, []);

  const onSearchConversation = debounce(async (e) => {
    offset.current = 0;
    keyword.current = e.target.value;
    getConversationsHandler({
      limit: 25,
      offset: 0,
      type: 'private',
      keyword: keyword.current,
      isMore: false
    });
  }, 500);

  const handleScroll = async (event: { target: any; }) => {
    const { requesting, data, total } = conversationState.list;
    const canLoadMore = total > data.length;
    const ele = event.target;
    if (!canLoadMore) return;
    if ((ele.offsetHeight + ele.scrollTop >= ele.scrollHeight - 10) && !requesting && canLoadMore) {
      offset.current += 1;
      getConversationsHandler({
        keyword: keyword.current,
        limit: 25,
        offset: offset.current,
        type: 'private',
        isMore: true
      });
    }
  };

  const setActive = (conversationId: any) => {
    setActiveConversationHandler({ conversationId });
    conversationState?.activeConversation?._id && setDeactiveConversationHandler(conversationState?.activeConversation?._id);
  };

  const { data: conversations, requesting } = conversationState.list;
  const { mapping, activeConversation = {} } = conversationState;

  return (
    <div className={classNames(
      style['conversation-list']
    )}
    >
      <div className={style['user-bl']}>
        <MessageIcon />
        &nbsp;
        Messages
      </div>
      <ConversationSearch
        onSearch={(e) => {
          e.persist();
          onSearchConversation(e);
        }}
      />
      <div className={style['c-list-container']} onScroll={handleScroll}>
        {conversations.length > 0
            && conversations.map((conversationId) => (
              <ConversationListItem
                key={conversationId}
                data={mapping[conversationId]}
                setActive={setActive}
                selected={activeConversation._id === conversationId}
              />
            ))}
        {requesting && (
        <div className="text-center" style={{ margin: 30 }}><Spin /></div>
        )}
        {!requesting && !conversations.length && (
        <p className="text-center">No conversation found.</p>
        )}
      </div>
    </div>
  );
}

const mapStates = (state: any) => ({
  conversationState: { ...state.conversation },
  user: { ...state.user.current }
});

const mapDispatch = {
  getConversations,
  setActiveConversation,
  deactiveConversation
};
export default connect(mapStates, mapDispatch)(ConversationList);
