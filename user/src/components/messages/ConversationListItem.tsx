import { IConversation } from '@interfaces/message';
import { formatDateFromnow } from '@lib/index';
import { Avatar, Badge } from 'antd';
import { TickIcon } from 'src/icons';

import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { ImageWithFallback } from '@components/common';
import style from './ConversationListItem.module.scss';

interface IProps {
  data: IConversation;
  setActive: Function;
  selected: boolean;
}

export default function ConversationListItem(props: IProps) {
  const { data, setActive, selected } = props;
  const {
    recipientInfo, lastMessage, _id, totalNotSeenMessages = 0, lastMessageCreatedAt, updatedAt
  } = data;
  const className = classNames(
    style['conversation-list-item'],
    {
      [style.active]: selected
    }
  );
  return (
    <div aria-hidden className={className} onClick={() => setActive(_id)}>
      <div className={style['conversation-left-corner']}>
        <Avatar
          className={style['conversation-photo']}
          src={recipientInfo?.avatar || '/no-avatar.jpg'}
          srcSet={recipientInfo?.avatar || '/no-avatar.jpg'}
        />
        <span className={recipientInfo?.isOnline > 0 ? `${style['online-status']} ${style.active}` : style['online-status']} />
      </div>
      <div className={style['conversation-info']}>
        <h1 className={style['conversation-title']}>
          <span className={style['re-name']} title={recipientInfo?.name || recipientInfo?.username || 'N/A'}>
            {recipientInfo?.name || recipientInfo?.username || 'N/A'}
            {recipientInfo?.verifiedAccount && <TickIcon />}
          </span>
          <span className={style['conversation-time']}>{formatDateFromnow(lastMessageCreatedAt || updatedAt)}</span>
        </h1>
        <p className={style['conversation-snippet']}>{lastMessage}</p>
      </div>
      <Badge
        className={style['notification-badge']}
        count={totalNotSeenMessages}
      />
    </div>
  );
}
