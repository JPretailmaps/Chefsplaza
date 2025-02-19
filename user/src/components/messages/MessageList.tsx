import { ArrowLeftOutlined } from '@ant-design/icons';
import { deactiveConversation, loadMoreMessages } from '@redux/message/actions';
import { Avatar, Button, Spin } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import { useRef } from 'react';
import { connect } from 'react-redux';
import { TickIcon } from 'src/icons';
import classNames from 'classnames';
import { IConversation } from '@interfaces/message';
import { IUser } from '@interfaces/user';
import dynamic from 'next/dynamic';
import style from './MessageList.module.scss';

const ViewMediaPopupContainer = dynamic(() => import('src/context/view-media-popup/view-media-popup-container'), { ssr: false });
const Message = dynamic(() => import('./Message'));
const Compose = dynamic(() => import('./Compose'));

interface IProps {
  deactiveConversation: Function;
  loadMoreMessages: Function;
  messageState: any;
  conversation: IConversation;
  currentUser: IUser;
}

export function MessageList({
  deactiveConversation: onDeactiveConversation,
  loadMoreMessages: handleLoadMoreMessages,
  messageState,
  conversation,
  currentUser
}: IProps) {
  const messagesRef = useRef<HTMLDivElement>();
  const offset = useRef(0);

  const { fetching, items, total } = messageState;

  const handleScroll = (event) => {
    const canloadmore = total > items.length;
    const ele = event.target;
    if (!canloadmore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canloadmore) {
      offset.current += 1;
      handleLoadMoreMessages({
        conversationId: conversation._id,
        limit: 25,
        offset: offset.current * 25
      });
      setTimeout(() => {
        const scrollToId = document.getElementById(items[0]._id);
        scrollToId && scrollToId.scrollIntoView({ behavior: 'auto', block: 'center' });
      }, 1000);
    }
  };

  const renderMessages = () => {
    const { items: messages } = messageState;
    let i = 0;
    const messageCount = messages.length;
    const tempMessages = [];
    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = current.senderId === currentUser._id;
      const currentMoment = moment(current.createdAt);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        const previousMoment = moment(previous.createdAt);
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
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
          <ViewMediaPopupContainer>
            <Message
              key={current.isDeleted ? `${current._id}_deleted` : `${current._id}`}
              isMine={isMine}
              startsSequence={startsSequence}
              endsSequence={endsSequence}
              showTimestamp={showTimestamp}
              data={current}
              recipient={conversation?.recipientInfo}
              currentUser={currentUser}
            />
          </ViewMediaPopupContainer>
        );
      }
      // Proceed to the next message.
      i += 1;
    }
    scrollToBottom();
    return tempMessages;
  };

  const scrollToBottom = () => {
    // if (onScrolling || fetching) return;
    const ele = messagesRef.current as HTMLDivElement;
    if (ele && ele.scrollTop === ele.scrollHeight) return;
    window.setTimeout(() => {
      ele && ele.scrollTo({ top: ele.scrollHeight, behavior: 'smooth' });
    }, 400);
  };

  const onClose = () => {
    conversation?._id && onDeactiveConversation(conversation._id);
  };

  return (
    <div
      className={classNames(
        style['message-list']
      )}
      onScroll={handleScroll}
    >
      {conversation && conversation._id
        ? (
          <>
            <div aria-hidden className={style['mess-recipient']}>
              <Button type="link" onClick={() => onClose()} className={style['close-btn']}><ArrowLeftOutlined /></Button>
              <span
                className={style.recipient}
                aria-hidden
                onClick={() => conversation?.recipientInfo?.isPerformer && Router.push({ pathname: '/[profileId]', query: { profileId: conversation?.recipientInfo?.username || conversation?.recipientInfo?._id } }, `/${conversation?.recipientInfo?.username || conversation?.recipientInfo?._id}`)}
              >
                <Avatar alt="avatar" src={conversation?.recipientInfo?.avatar || '/no-avatar.jpg'} />
                {' '}
                {conversation?.recipientInfo?.name || conversation?.recipientInfo?.username || 'N/A'}
                {' '}
                {conversation?.recipientInfo?.verifiedAccount && <TickIcon />}
              </span>

            </div>
            <div className={style['message-list-container']} ref={messagesRef as any}>
              {fetching && <div className="text-center" style={{ margin: '30px 0' }}><Spin /></div>}
              {renderMessages()}
              {!fetching && !items.length && <p className="text-center" style={{ margin: '30px 0' }}>Let&apos;s talk</p>}
              {!conversation.isSubscribed && (
              <Link href={{ pathname: '/[profileId]', query: { profileId: conversation?.recipientInfo?.username || conversation?.recipientInfo?._id } }} as={`/${conversation?.recipientInfo?.username || conversation?.recipientInfo?._id}`}>
                <div className={style['sub-text']}>Please subscribe to this creator to start the conversation!</div>
              </Link>
              )}
              {conversation.isBlocked && <div className={style['sub-text']}>This creator has blocked you!</div>}
            </div>
            <Compose disabled={!conversation.isSubscribed || conversation.isBlocked} conversation={conversation} />
          </>
        )
        : <p className="text-center" style={{ margin: '30px 0' }}>Click on conversation to start</p>}
    </div>
  );
}

const mapStates = (state: any) => {
  const { conversationMap } = state.message;
  const { activeConversation } = state.conversation;
  const messages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].items || []
    : [];
  const totalMessages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].total || 0
    : 0;
  const fetching = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].fetching || false : false;
  return {
    messageState: {
      items: messages,
      total: totalMessages,
      fetching
    },
    conversation: activeConversation,
    currentUser: state.user.current
  };
};

const mapDispatch = { loadMoreMessages, deactiveConversation };
export default connect(mapStates, mapDispatch)(MessageList);
