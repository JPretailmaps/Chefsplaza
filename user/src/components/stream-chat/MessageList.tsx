import {
  deleteMessageSuccess,
  loadMoreStreamMessages,
  receiveStreamMessageSuccess,
  resetAllStreamMessage
} from '@redux/stream-chat/actions';
import { Spin } from 'antd';
import moment from 'moment';
import {
  useRef
} from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  IConversation, IMessage, IMessageState, IUser
} from 'src/interfaces';
import { Event } from 'src/socket';

import classNames from 'classnames';
import StreamChatCompose from './Compose';
import Message from './Message';
import style from './MessageList.module.scss';

interface IProps {
  messageState: IMessageState;
  conversation: IConversation;
  user: IUser;
}

function StreamMessageList({
  user,
  messageState,
  conversation
}: IProps) {
  const messagesRef = useRef<HTMLDivElement>();
  const offset = useRef(0);
  const dispatch = useDispatch();
  const { fetching, items, total } = messageState;

  const handleScroll = (event: any) => {
    const canloadmore = total > items.length;
    const ele = event.target;
    if (!canloadmore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canloadmore) {
      offset.current += 1;
      dispatch(loadMoreStreamMessages({
        conversationId: conversation._id,
        limit: 25,
        offset: offset.current * 25,
        type: conversation.type
      }));
      setTimeout(() => {
        const getMeTo = document.getElementById(items[0]._id);
        getMeTo && getMeTo.scrollIntoView({ behavior: 'auto', block: 'center' });
      }, 1000);
    }
  };

  const renderMessages = () => {
    let i = 0;
    const messageCount = items && items.length;
    const tempMessages = [];
    while (i < messageCount) {
      const previous = items[i - 1];
      const current = items[i];
      const next = items[i + 1];
      const isMine = current?.senderId === user?._id;
      const currentMoment = moment(current.createdAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = false;
      if (previous) {
        const previousMoment = moment(previous.createdAt);
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }
      }

      if (previous && moment(current.createdAt).startOf('days').diff(moment(previous.createdAt).startOf('days')) > 0) {
        showTimestamp = true;
      }

      if (next) {
        const nextMoment = moment(next.createdAt);
        const nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.senderId === current.senderId;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }
      if (current._id) {
        tempMessages.push(
          <Message
            isOwner={conversation.performerId === current.senderId}
            key={current.isDeleted ? `${current._id}_deleted_${i}` : `${current._id}_${i}`}
            isMine={isMine}
            startsSequence={startsSequence}
            endsSequence={endsSequence}
            showTimestamp={showTimestamp}
            data={current}
          />
        );
      }
      // Proceed to the next message.
      i += 1;
    }
    scrollToBottom();
    return tempMessages;
  };

  const onMessage = (type: string, message: IMessage) => {
    if (!message) {
      return;
    }
    type === 'created' && dispatch(receiveStreamMessageSuccess(message));
    type === 'deleted' && dispatch(deleteMessageSuccess(message));
  };

  const onClearAllMessage = ({ conversationId }) => {
    if (conversationId !== conversation?._id) return;
    dispatch(resetAllStreamMessage({ conversationId }));
  };

  const scrollToBottom = () => {
    if (fetching) return;
    const ele = messagesRef.current as HTMLDivElement;
    if (ele && ele.scrollTop === ele.scrollHeight) return;
    window.setTimeout(() => {
      ele && ele.scrollTo({ top: ele.scrollHeight, behavior: 'smooth' });
    }, 500);
  };

  return (
    <>
      {conversation?._id && (
      <>
        <Event event={`message_created_conversation_${conversation?._id}`} handler={(data) => onMessage('created', data)} />
        <Event event={`message_deleted_conversation_${conversation?._id}`} handler={(data) => onMessage('deleted', data)} />
        <Event event={`clear_all_messages_${conversation?._id}`} handler={onClearAllMessage} />
      </>
      )}
      <div
        className={classNames(style['message-list'], 'message-list-custom')}
        onScroll={handleScroll}
      >
        {conversation?._id && (
        <>
          <div className={style['message-list-container']} ref={messagesRef}>
            {fetching && <div className="text-center" style={{ marginTop: '50px' }}><Spin /></div>}
            {renderMessages()}
            {!fetching && !items.length && <p className="text-center">Let&apos;s start talking something</p>}
          </div>
          <StreamChatCompose conversation={conversation} />
        </>
        )}
      </div>
    </>

  );
}

const mapStates = (state: any) => {
  const { conversationMap, activeConversation } = state.streamMessage;
  const messages = activeConversation && conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].items || []
    : [];
  const totalMessages = activeConversation && conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].total || 0
    : 0;
  const fetching = activeConversation && conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].fetching || false
    : false;
  return {
    messageState: {
      items: messages,
      total: totalMessages,
      fetching
    },
    conversation: activeConversation,
    user: state.user.current
  };
};

const mapDispatch = {
};
export default connect(mapStates, mapDispatch)(StreamMessageList);
