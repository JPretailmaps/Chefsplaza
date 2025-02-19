import { showError } from '@lib/utils';
import { Button, message } from 'antd';
import { useState } from 'react';
import { messageService } from 'src/services';
import {
  DownOutlined, UpOutlined
} from '@ant-design/icons';

import dynamic from 'next/dynamic';
import style from './chat-box.module.scss';

const StreamMessageList = dynamic(() => import('@components/stream-chat/MessageList'), { ssr: false });

interface IProps {
  canReset: boolean;
  conversationId: string;
}

function ChatBox({
  conversationId,
  canReset
}: IProps) {
  const [removing, setRemoving] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const removeAllMessage = async () => {
    try {
      if (!canReset) {
        message.error('You don\'t have permission!');
        return;
      }
      setRemoving(true);
      if (!window.confirm('Are you sure you want to clear all chat history?')) {
        return;
      }
      await messageService.deleteAllMessageInConversation(
        conversationId
      );
    } catch (e) {
      showError(e);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <div className={`${style['conversation-stream']} ${!showChat ? 'hide-conversation' : ' '}`}>
        {conversationId && (
          <Button className="hide-chat" onClick={() => setShowChat(!showChat)}>
            {showChat && (
              <span>
                <DownOutlined />
                {' '}
                Hide chat
              </span>
            )}
            {!showChat && (
              <span>
                <UpOutlined />
                {' '}
                Show chat
              </span>
            )}
          </Button>
        )}
        <div className={style['stream-chat']}>
          <div className={style['chat-ttl']}>CHAT</div>
          <StreamMessageList />
        </div>
      </div>
      {canReset && (
        <div style={{ margin: '14px' }}>
          <Button
            className="secondary"
            block
            loading={removing}
            onClick={() => removeAllMessage()}
          >
            Clear chat history
          </Button>
        </div>
      )}
    </>
  );
}

export default ChatBox;
