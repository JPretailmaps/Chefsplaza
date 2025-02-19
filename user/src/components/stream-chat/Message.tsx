import { EllipsisOutlined } from '@ant-design/icons';
import { Divider, Dropdown } from 'antd';
import moment from 'moment';
import { ImageWithFallback } from '@components/common';
import { useDispatch } from 'react-redux';
import { deleteMessage } from '@redux/stream-chat/actions';
import { MenuProps } from 'antd/lib';
import style from './Message.module.scss';

interface IProps {
  data: any;
  isMine: boolean,
  startsSequence: boolean,
  endsSequence: boolean,
  showTimestamp: boolean,
  isOwner: boolean
}

export default function Message({
  data,
  isMine,
  startsSequence,
  endsSequence,
  showTimestamp,
  isOwner
}: IProps) {
  const dispatch = useDispatch();
  const friendlyTimestamp = moment(data.createdAt).format('LLLL');
  const onDelete = () => {
    dispatch(deleteMessage({ messageId: data._id }));
  };

  const items: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Delete',
      onClick: () => onDelete()
    }
  ];

  return (
    <div
      id={data._id}
      className={[
        style.message,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}
    >
      {showTimestamp && (
        <Divider className={style.timestamp}>{friendlyTimestamp}</Divider>
      )}
      {data.text && !data.isSystem && data?.type !== 'tip' && (
        <div className={isOwner ? `${style['bubble-container']} ${style.owner}` : style['bubble-container']}>
          <div className={style['user-grp']}>
            <ImageWithFallback
              options={{
                width: 60,
                height: 60,
                sizes: '10vw',
                quality: 30,
                className: style.avatar
              }}
              alt="avatar"
              src={data?.senderInfo?.avatar || '/no-avatar.jpg'}
            />
          </div>
          <div className={style.bubble} title={friendlyTimestamp}>
            <span className={style.name}>
              {data?.senderInfo?.name || data?.senderInfo?.username || 'N/A'}
            </span>
            <span className={style.bubbletext}>{data.text}</span>
          </div>
          {isMine && !data.isDeleted && (
          <Dropdown menu={{ items }} placement="topRight" trigger={['click']}>
            <a>
              <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
            </a>
          </Dropdown>
          )}
        </div>
      )}
      {data?.type === 'tip' && (
      <div className={style['tip-box']}>
        <span>
          {data.text}
        </span>
      </div>
      )}
    </div>
  );
}
