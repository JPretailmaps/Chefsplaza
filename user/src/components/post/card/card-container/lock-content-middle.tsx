import {
  FileImageOutlined,
  LockOutlined, UnlockOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { IFeed } from '@interfaces/feed';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getThumbnail } from '@lib/utils';
import { Button } from 'antd';
import Price from '@components/common/price';
import { videoDuration } from '@lib/duration';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import style from './lock-content-middle.module.scss';

const ViewTeaserBtn = dynamic(() => import('./view-teaser-btn'), { ssr: false });
const ConfirmPurchase = dynamic(() => import('../../confirm-purchase'), { ssr: false });

type Props = {
  feed: IFeed;
};

function LockContentMiddle({
  feed
}: Props) {
  const [isHovered, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useSelector((state: any) => state.user.current);
  const router = useRouter();
  const thumbUrl = getThumbnail(feed);
  const images = feed.files?.filter((f) => f.type === 'feed-photo') || [];
  const videos = feed.files?.filter((f) => f.type === 'feed-video') || [];

  return (
    <div className={style['lock-content']}>
      <div
        className={style['feed-bg']}
        style={{
          backgroundImage: `url(${thumbUrl})`,
          filter: thumbUrl === '/leaf.jpg' ? 'blur(2px)' : 'blur(20px)'
        }}
      />
      <div className={style['lock-middle']}>
        {(isHovered) ? <UnlockOutlined /> : <LockOutlined />}
        {!feed.isSale && !feed.isSubscribed && (
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={user.isPerformer}
            className="secondary"
            type="primary"
            onClick={() => setShowModal(true)}
          >
            Subscribe to unlock
          </Button>
        )}
        {feed.isSale && feed.price > 0 && !feed.isBought && (
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={user.isPerformer}
            className="secondary"
            type="primary"
            onClick={() => setShowModal(true)}
          >
            Pay
            &nbsp;
            <Price amount={feed.price} />
          </Button>
        )}
        {(feed.isSale && !feed.price && !user._id) && (
          <Button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={user.isPerformer}
            className="secondary"
            type="primary"
            onClick={() => {
              router.push({
                pathname: '/[profileId]',
                query: {
                  profileId: feed.performer?.username || feed.performer?._id
                }
              });
            }}
          >
            Follow for free
          </Button>
        )}
        {feed.teaser && <ViewTeaserBtn teaser={feed.teaser} />}
      </div>
      {feed.files?.length > 0 && (
        <div className={style['count-media']}>
          <span className="count-media-item">
            {images.length > 0 && (
              <span>
                {images.length}
                {' '}
                <FileImageOutlined />
                {' '}
              </span>
            )}
            {videos.length > 0 && images.length > 0 && '|'}
            {videos.length > 0 && (
              <span>
                {videos.length > 1 && videos.length}
                {' '}
                <VideoCameraOutlined />
                {' '}
                {videos.length === 1 && videoDuration(videos[0].duration)}
              </span>
            )}
          </span>
        </div>
      )}
      {showModal && <ConfirmPurchase feed={feed} open={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default LockContentMiddle;
