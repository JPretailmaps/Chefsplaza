import { IStream } from '@interfaces/stream';
import { IUser } from '@interfaces/user';
import { setSubscription } from '@redux/subscription/actions';
import { message } from 'antd';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import style from './style.module.scss';

type Props = {
  stream: IStream;
}

export default function StreamItem({ stream }: Props) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.current) as IUser;

  const handleClick = () => {
    if (!user._id) {
      message.error('Please log in or register!');
      Router.push({
        pathname: '/auth/login',
        href: '/'
      });
      return;
    }
    if (user.isPerformer) return;
    if (!stream?.isSubscribed) {
      message.error('Please subscribe to join live chat!');
      dispatch(setSubscription({ showModal: true, performer: stream.performerInfo, subscriptionType: 'monthly' }));
      return;
    }
    Router.push(
      {
        pathname: '/streaming/[username]',
        query: {
          username: stream?.performerInfo?.username || stream?.performerInfo?._id
        }
      },
      `/streaming/${stream?.performerInfo?.username || stream?.performerInfo?._id}`
    );
  };

  return (
    <div
      aria-hidden
      onClick={handleClick}
      key={stream?._id}
      className={style['stream-card']}
      title={stream?.performerInfo?.name || stream?.performerInfo?.username || 'N/A'}
    >
      <div className={style['blink-border']} />
      <img className={style['per-avatar']} alt="avatar" src={stream?.performerInfo?.avatar || '/no-avatar.jpg'} />
      <div className={style['live-tag']}>LIVE</div>
    </div>
  );
}
