import {
  CommentOutlined, FileImageOutlined, HeartOutlined, LockOutlined, UnlockOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import {
  getThumbnail, shortenLargeNumber, videoDuration
} from '@lib/index';
import { Button, Tooltip } from 'antd';
import { IFeed } from 'src/interfaces';
import { useSelector } from 'react-redux';
import { ImageWithFallback } from '@components/common';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import style from './grid-card.module.scss';

const ScheduledStreamingContent = dynamic(() => import('./card-container/scheduled-streaming'));

interface IProps {
  feed: IFeed;
}

function FeedGridCard({ feed }: IProps) {
  const user = useSelector((state: any) => state.user.current);
  let canView = (!feed.isSale && feed.isSubscribed)
    || feed.isBought
    || ['text', 'scheduled-streaming'].includes(feed.type)
    || (feed.isSale && !feed.price);

  if (!user._id || (`${user._id}` !== `${feed.fromSourceId}` && user.isPerformer)) {
    canView = false;
  }
  const images = feed.files && feed.files.filter((f) => f.type === 'feed-photo');
  const videos = feed.files && feed.files.filter((f) => f.type === 'feed-video');
  const thumbUrl = (canView ? ((feed?.thumbnail?.url) || (images && images[0] && images[0]?.url) || (videos && videos[0] && videos[0].thumbnails && videos[0].thumbnails[0]) || (feed?.teaser && feed?.teaser?.thumbnails && feed?.teaser?.thumbnails[0]))
    : getThumbnail(feed, '/leaf.jpg'));

  return (
    <div
      aria-hidden
      onClick={() => Router.push({ pathname: '/post/[id]', query: { id: feed.slug || feed._id } }, `/post/${feed.slug || feed._id}`)}
      className={style['feed-grid-card']}
      key={feed._id}
    >
      <Tooltip title={feed.text || ''}>
        {feed.type === 'scheduled-streaming' ? (
          <ScheduledStreamingContent feed={feed} />
        ) : (
          <>
            <ImageWithFallback
              options={{
                with: 750,
                height: 750,
                quality: 50,
                sizes: '(max-width: 767px) 100vw, (min-width: 768px) 20vw',
                style: { filter: !canView ? 'blur(20px)' : 'blur(0px)' }
              }}
              alt="post"
              src={thumbUrl}
              fallbackSrc="/leaf.jpg"
            />
            <div className={style['card-middle']}>
              {canView ? <UnlockOutlined /> : <LockOutlined />}
              {(!feed.isSale && !feed.isSubscribed) && <Button type="link">Subscribe to unlock</Button>}
              {(feed.isSale && !feed.isBought) && <Button type="link">Pay now to unlock</Button>}
            </div>
          </>
        )}
      </Tooltip>
      <div className={style['card-bottom']}>
        <div className={style.stats}>
          <span>
            <HeartOutlined />
            {' '}
            {feed.totalLike > 0 ? shortenLargeNumber(feed.totalLike) : 0}
          </span>
          <span>
            <CommentOutlined />
            {' '}
            {feed.totalComment > 0 ? shortenLargeNumber(feed.totalComment) : 0}
          </span>
        </div>
        {feed.files && feed.files.length > 0 && (
          <span className={style['count-media-item']}>
            {images.length > 0 && (
            <span>
              {images.length > 1 && images.length}
              {' '}
              <FileImageOutlined />
              {' '}
            </span>
            )}
            {videos.length > 0 && images.length > 0 && '|'}
            {videos.length > 0 && (
            <span>
              <VideoCameraOutlined />
              {' '}
              {videos.length === 1 && videoDuration(videos[0]?.duration)}
            </span>
            )}
          </span>
        )}
        {feed.type === 'scheduled-streaming' }
      </div>
    </div>
  );
}

export default FeedGridCard;
