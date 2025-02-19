import { IUser } from '@interfaces/index';
import {
  Avatar, Dropdown, MenuProps
} from 'antd';
import moment from 'moment';
import React from 'react';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';

import { useDispatch } from 'react-redux';
import { deletePrivateMessage } from '@redux/message/actions';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import style from './Message.module.scss';

const MessageMediaSlider = dynamic(() => import('./MessageSlider'), { ssr: false });

interface IProps {
  data: any;
  isMine: boolean;
  startsSequence: boolean;
  endsSequence: boolean;
  showTimestamp: boolean;
  currentUser: IUser;
  recipient: IUser;
}

export function Message({
  data, isMine, startsSequence, endsSequence, showTimestamp, currentUser, recipient
}: IProps) {
  const dispatch = useDispatch();
  const friendlyTimestamp = moment(data.createdAt).format('LLLL');

  const items: MenuProps['items'] = [
    {
      key: 'delete',
      label: (
        <>
          <DeleteOutlined />
          {' '}
          Delete
        </>
      )
    }
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'delete') {
      dispatch(deletePrivateMessage({ messageId: data._id }));
    }
  };

  return (
    <div
      id={data._id}
      className={[
        style.message,
        `${isMine ? style.mine : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}
    >
      {data.text && (
        <div className={style['bubble-container']}>
          {isMine && (
            <div className={style['bubble-action']}>
              <Dropdown menu={{ items, onClick }} placement="bottomRight">
                <MoreOutlined />
              </Dropdown>
            </div>
          )}
          {!isMine && <Avatar alt="" className={style.avatar} src={recipient?.avatar || '/no-avatar.jpg'} />}
          <div
            className={classNames(style.bubble, { [style.media]: data?.files && data.files.length > 0 })}
            title={friendlyTimestamp}
          >
            {data?.type === 'media' && data?.files && data.files?.length > 0 && (
            <div className={classNames(style['media-viewer'], { [style.mediaone]: data?.files && data.files.length === 1 })}>
              <MessageMediaSlider files={data.files} messageId={data._id} />
            </div>
            )}
            <div className={classNames({ [style['message-text']]: true })}>
              {data?.text}
            </div>
          </div>
          {isMine && <Avatar alt="" src={currentUser?.avatar || '/no-avatar.jpg'} className={style.avatar} />}
        </div>
      )}
      {showTimestamp && <div className={style.timestamp}>{friendlyTimestamp}</div>}
    </div>
  );
}

export default Message;
