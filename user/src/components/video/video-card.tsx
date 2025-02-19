import {
  CalendarOutlined,
  EyeOutlined, HourglassOutlined, LikeOutlined, LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import { shortenLargeNumber, videoDuration } from '@lib/index';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { IUIConfig, IVideo } from 'src/interfaces';

import { ImageWithFallback } from '@components/common';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import style from './video-card.module.scss';

interface IProps {
  video: IVideo;
}

export function VideoCard({ video }: IProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canView = (!video.isSale && video.isSubscribed) || (video.isSale && video.isBought);
  const thumbUrl = (canView ? video?.thumbnail?.url : (video?.thumbnail?.thumbnails && video?.thumbnail?.thumbnails[0])) || (video?.teaser?.thumbnails && video?.teaser?.thumbnails[0]) || (video?.video?.thumbnails && video?.video?.thumbnails[0]) || '/no-image.jpg';
  return (
    <Link
      href={{ pathname: '/video/[id]', query: { id: video.slug || video._id } }}
      as={`/video/${video.slug || video._id}`}
    >
      <div
        className={classNames(style['vid-card'])}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {video.isSale && video.price > 0 && (
          <span className={style['vid-price']}>
            <div className={style['label-price']}>
              $
              {(video.price || 0).toFixed(2)}
            </div>
          </span>
        )}
        {video.isSchedule && (
          <span className={style['vid-calendar']}>
            <CalendarOutlined />
          </span>
        )}
        <div className={style['vid-thumb']}>
          <ImageWithFallback
            options={{
              width: 250,
              height: 250,
              quality: 70,
              sizes: '(max-width: 768px) 30vw, (max-width: 2100px) 20vw',
              className: style['card-bg'],
              style: { filter: !canView ? 'blur(20px)' : 'blur(0px)' }
            }}
            alt="thumb"
            src={thumbUrl}
            fallbackSrc="/no-image.jpg"
          />
          <div className={style['vid-stats']}>
            <span>
              <a>
                <EyeOutlined />
                {' '}
                {shortenLargeNumber(video?.stats?.views || 0)}
              </a>
              <a>
                <LikeOutlined />
                {' '}
                {shortenLargeNumber(video?.stats?.likes || 0)}
              </a>
            </span>
            <a>
              <HourglassOutlined />
              {' '}
              {videoDuration(video?.video?.duration || 0)}
            </a>
          </div>
          <div className={style['lock-middle']}>
            {(canView || isHovered) ? <UnlockOutlined /> : <LockOutlined />}
            {/* {(!video.isSale && !video.isSubscribed) && <Button type="link">Subscribe to unlock</Button>}
              {(video.isSale && !video.isBought) && <Button type="link">Pay now to unlock</Button>} */}
          </div>
        </div>
        <Tooltip title={video.title}>
          <div className={style['vid-info']}>
            {video.title}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
}
