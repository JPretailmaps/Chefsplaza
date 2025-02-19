import {
  SendOutlined, SmileOutlined, PaperClipOutlined
} from '@ant-design/icons';
import { sendMessageSuccess } from '@redux/message/actions';
import { messageService } from '@services/index';
import {
  Button, Input, message
} from 'antd';
import classNames from 'classnames';
import {
  useReducer,
  useRef, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IConversation } from 'src/interfaces';
import dynamic from 'next/dynamic';
import { showError } from '@lib/utils';
import { skeletonLoading } from '@lib/loading';
import style from './Compose.module.scss';

const Emotions = dynamic(() => (import('@components/common/emotions')), { ssr: false, loading: () => <div style={{ width: 320 }} className="skeleton-loading" /> });
const MessageUploadMedia = dynamic(() => (import('./MessageUploadMedia')), { ssr: false, loading: skeletonLoading });

interface IProps {
  conversation: IConversation;
  disabled?: boolean;
}

function Compose({
  conversation, disabled
}: IProps) {
  const _input = useRef() as any;
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [typeMessage, setTypeMessage] = useState<string>('text');
  const [isOpenUploadMedia, setIsOpenUploadMedia] = useState<boolean>(false);
  const [submiting, setsubmiting] = useState(false);
  const [text, setText] = useState('');

  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const resetState = () => {
    setTypeMessage('text');
    setIsOpenUploadMedia(false);
    setsubmiting(false);
    setText('');
    setFiles([]);
  };

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    // eslint-disable-next-line no-param-reassign
    if (file.percent === 100) file.status = 'done';
    forceUpdate();
  };

  const onKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      send();
    }
  };

  const onChange = (evt) => {
    setText(evt.target.value);
  };

  const onEmojiClick = (emoji) => {
    if (disabled) return;
    setText(text ? `${text} ${emoji} ` : `${emoji} `);
  };

  const onSubmit = async () => {
    try {
      setsubmiting(true);
      // upload file media
      const fileIds = [];
      if ((files.length) > 6) {
        message.error('You can upload maximum 6 files!');
        return;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const fileItem of files) {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(fileItem.status) || fileItem._id) continue;
        fileItem.status = 'uploading';
        let resp = null;
        if ((fileItem.type.indexOf('image') > -1)) {
          // eslint-disable-next-line no-await-in-loop
          resp = await messageService.uploadPublicPhoto(
            fileItem,
            {},
            (r) => onUploading(fileItem, r)
          );
        }
        if ((fileItem.type.indexOf('video') > -1)) {
          // eslint-disable-next-line no-await-in-loop
          resp = await messageService.uploadVideo(
            fileItem,
            {},
            (r) => onUploading(fileItem, r)
          );
        }
        fileItem.status = 'done';
        fileIds.push(resp.data._id);
      }

      const payload = {
        text: text || `Attached ${files.length > 1 ? 'some files' : 'a file'}`,
        fileIds,
        type: typeMessage
      };

      // send message
      const resp = await messageService.sendMessage(conversation._id, payload);
      resetState();
      _input.current && _input.current.focus();
      dispatch(sendMessageSuccess(resp.data));
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const send = () => {
    if (isOpenUploadMedia && !files.length) {
      message.error('Select a file upload!');
      return;
    }
    if (!isOpenUploadMedia && !text.trim()) {
      message.error('Enter your message!');
      return;
    }

    onSubmit();
  };

  const handleOpenUploadMedia = () => {
    setTypeMessage(typeMessage === 'media' ? 'text' : 'media');
    setIsOpenUploadMedia(!isOpenUploadMedia);
  };

  return (
    <div className={classNames(
      style['compose-container']
    )}
    >
      {isOpenUploadMedia && (
        <MessageUploadMedia
          onFilesSelected={(_files) => setFiles(_files)}
          onClose={() => setIsOpenUploadMedia(false)}
        />
      )}
      <div className={style['compose-chat']}>
        <Input.TextArea
          value={text}
          className={style['compose-input']}
          placeholder="Write your message..."
          onKeyDown={onKeyDown}
          onChange={onChange}
          disabled={disabled || !conversation._id || submiting}
          ref={_input}
          autoFocus
        />
        <Button className={style['grp-icons']}>
          <Emotions onEmojiClick={onEmojiClick} />
          <SmileOutlined />
        </Button>
        <Button
          disabled={disabled || !conversation._id || submiting}
          onClick={handleOpenUploadMedia}
          className={
            classNames(
              style['grp-icons'],
              { [style.active]: isOpenUploadMedia }
            )
          }
        >
          <PaperClipOutlined />
        </Button>
        <Button
          disabled={disabled || !conversation._id || submiting}
          className={style['grp-send']}
          onClick={send}
        >
          <SendOutlined />
        </Button>
      </div>
    </div>
  );
}

Compose.defaultProps = {
  disabled: false
};

export default Compose;
