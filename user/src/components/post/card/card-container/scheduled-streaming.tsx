import { IFeed } from '@interfaces/feed';
import moment from 'moment';
import ReactMomentCountDown from 'react-moment-countdown';
import Link from 'next/link';
import { ImageWithFallback } from '@components/common';
import { Button, Divider, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { showError } from '@lib/utils';
import { followService } from '@services/follow.service';
import { IUser } from '@interfaces/user';
import { useSelector, useDispatch } from 'react-redux';
import { addFollowId, removeFollowId } from '@redux/follow/actions';
import style from './scheduled-streaming.module.scss';

type P = {
  feed: IFeed;
}

export default function ScheduledStreamingContent({ feed }: P) {
  const { followedIds } = useSelector((state: any) => state.follow);
  const user = useSelector((state: any) => state.user.current) as IUser;
  const dispatch = useDispatch();

  const handleFollow = async () => {
    if (user.isPerformer) return;
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    try {
      if (!isFollowed) {
        await followService.create(feed.fromSourceId);
        dispatch(addFollowId(feed.fromSourceId));
      } else {
        await followService.delete(feed.fromSourceId);
        dispatch(removeFollowId(feed.fromSourceId));
      }
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    if (feed?.isFollowed) {
      if (followedIds.includes(feed.fromSourceId)) return;
      dispatch(addFollowId(feed.fromSourceId));
    }
  }, [feed, followedIds]);

  const isFollowed = followedIds.includes(feed.fromSourceId);

  return (
    <div className={style['streaming-content']}>
      <ImageWithFallback
        options={{
          quality: 70,
          width: 692,
          height: 390
        }}
        alt="thumb"
        src={feed?.thumbnail?.url || '/live-streaming.jpg'}
        fallbackSrc="/live-streaming.jpg"
      />
      <div className={style['stream-txt-box']}>
        {feed?.streamingScheduled && moment(feed?.streamingScheduled).isAfter(moment()) && <>The model will stream in  </>}
        {feed?.streamingScheduled && moment(feed?.streamingScheduled).isAfter(moment()) ? (
          <>
            {`${moment(feed?.streamingScheduled).diff(moment(), 'days') > 0 ? `${moment(feed?.streamingScheduled).diff(moment(), 'days')} ${moment(feed?.streamingScheduled).diff(moment(), 'days') > 1 ? 'days' : 'day'}` : ''}`}
            <br />
            <ReactMomentCountDown toDate={moment(feed?.streamingScheduled)} />
          </>
        ) : (
          <Link
            href={{ pathname: '/streaming/[username]', query: { username: feed?.performer?.username || feed?.fromSourceId } }}
            as={`/streaming/${feed?.performer?.username || feed?.fromSourceId}`}
          >
            {`Live has started at ${moment(feed.streamingScheduled).utc().format('LLL')} UTC`}
          </Link>
        )}
        {!isFollowed && !feed.isSubscribed && !user?.isPerformer && <Divider><BellOutlined /></Divider>}
        {!isFollowed && !feed.isSubscribed && !user?.isPerformer && (
        <Button className="secondary" onClick={() => handleFollow()}>

          Get Notified!
        </Button>
        )}
      </div>
    </div>
  );
}
