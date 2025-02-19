import { IFeed } from '@interfaces/feed';
import { IUser } from '@interfaces/user';
import { Button, message } from 'antd';
import Router from 'next/router';
import style from './join-live-button.module.scss';

type P = {
  feed: IFeed;
  user: IUser;
}

export function JoinStreamButton({ feed, user }: P) {
  const handleJoinStream = () => {
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    if (user.isPerformer) return;
    if (!feed?.isSubscribed) {
      message.error('Please subscribe to this creator!');
      return;
    }
    Router.push({
      pathname: '/streaming/[username]',
      query: {
        performer: JSON.stringify(feed?.performer),
        username: feed?.performer?.username || feed?.performer?._id
      }
    }, `/streaming/${feed?.performer?.username || feed?.performer?._id}`);
  };

  return (
    <Button onClick={handleJoinStream} className={style['live-status']}>
      <i />
      {' '}
      Live
    </Button>
  );
}

export default JoinStreamButton;
