import {
  SendOutlined, SmileOutlined
} from '@ant-design/icons';
import { sendStreamMessage } from '@redux/stream-chat/actions';
import { Input, message } from 'antd';
import {
  useEffect, useRef, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { IConversation } from '@interfaces/message';
import { IUser } from '@interfaces/user';
import style from './Compose.module.scss';

const Emotions = dynamic(() => (import('@components/common/emotions')), { ssr: false });

const { TextArea } = Input;

interface IProps {
  conversation: IConversation;
}

function StreamChatCompose({ conversation }: IProps) {
  const user = useSelector((state: any) => state.user.current) as IUser;
  const sendMessageStatus = useSelector((state: any) => state.streamMessage.sendMessage);
  const _input = useRef() as any;
  const [text, setText] = useState('');
  const dipatch = useDispatch();

  useEffect(() => {
    if (sendMessageStatus.success) {
      updateMessage();
      _input.current && _input.current.focus();
    }
  }, [sendMessageStatus.success]);

  const onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      send();
    }
  };

  const onChange = (evt) => {
    setText(evt.target.value);
  };

  const onEmojiClick = (emoji) => {
    setText(text ? `${text} ${emoji} ` : `${emoji} `);
  };

  const updateMessage = () => {
    setText('');
  };

  const send = () => {
    if (!user._id) {
      message.error('Please login');
      return;
    }
    if (!text) {
      return;
    }
    dipatch(sendStreamMessage({
      conversationId: conversation._id,
      data: {
        text
      },
      type: conversation.type
    }));
  };

  return (
    <div className={`${style.compose}`}>
      <TextArea
        value={text}
        className={style['compose-input']}
        placeholder="Enter message here."
        onKeyDown={onKeyDown}
        onChange={onChange}
        disabled={sendMessageStatus.sending}
        ref={_input}
        rows={1}
      />
      <div className={style['grp-icons']}>
        <Emotions onEmojiClick={onEmojiClick} />
        <SmileOutlined />
      </div>
      <div aria-hidden className={style['grp-send']} onClick={send}>
        <SendOutlined />
      </div>
    </div>
  );
}

export default StreamChatCompose;
