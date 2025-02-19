import { deactiveConversation, deletePrivateMessageSuccess, sendMessageSuccess } from '@redux/message/actions';
import { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { SocketContext } from 'src/socket';
import { IMessage } from '@interfaces/message';
import style from './Messenger.module.scss';

const MessageList = dynamic(() => (import('./MessageList')));
const ConversationList = dynamic(() => (import('./ConversationList')));

interface IProps {
  toSource?: string;
  toId?: string;
}

function Messenger({
  toSource,
  toId
}: IProps) {
  const activeConversation = useSelector((state: any) => state.conversation.activeConversation);
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);

  const onMessage = (message: IMessage, event = 'created') => {
    if (!message) {
      return;
    }
    event === 'created' && dispatch(sendMessageSuccess(message));
    // handle delete
    event === 'deleted' && dispatch(deletePrivateMessageSuccess(message));
  };

  useEffect(() => {
    if (!toSource && !toId) {
      dispatch(deactiveConversation());
    }
  }, []);

  useEffect(() => {
    socket && socket.on('message_created', (data) => onMessage(data, 'created'));
    socket && socket.on('message_deleted', (data) => onMessage(data, 'deleted'));

    return () => {
      socket && socket.off('message_created', (data) => onMessage(data, 'created'));
      socket && socket.off('message_deleted', (data) => onMessage(data, 'deleted'));
    };
  }, [socket]);

  return (
    <div className={classNames(
      style.messenger
    )}
    >
      <div className={!activeConversation._id ? style.sidebar : `${style.sidebar} ${style.active}`}>
        <ConversationList toSource={toSource} toId={toId} />
      </div>
      <div className={classNames(style['chat-content'], {
        [style.active]: activeConversation._id
      })}
      >
        <MessageList />
      </div>
    </div>
  );
}

Messenger.defaultProps = {
  toSource: '',
  toId: ''
};

export default Messenger;
