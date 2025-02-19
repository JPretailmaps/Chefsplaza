import {
  EyeOutlined, LockOutlined, PictureOutlined, UnlockOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { IGallery, IUIConfig } from 'src/interfaces';

import { ImageWithFallback } from '@components/common';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import style from './gallery-card.module.scss';

interface GalleryCardIProps {
  gallery: IGallery;
}

function GalleryCard({ gallery }: GalleryCardIProps) {
  const [isHovered, setHover] = useState(false);
  const canView = (!gallery.isSale && gallery.isSubscribed) || (gallery.isSale && gallery.isBought);
  const thumbUrl = (!canView
    ? gallery?.coverPhoto?.thumbnails && gallery?.coverPhoto?.thumbnails[0]
    : gallery?.coverPhoto?.url) || '/no-image.jpg';
  return (
    <Link
      href={{
        pathname: '/gallery/[id]',
        query: { id: gallery?.slug || gallery?._id }
      }}
    >
      <div
        className={classNames(style['gallery-card'])}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {gallery?.isSale && gallery?.price > 0 && (
          <span className={style['gallery-price']}>
            <div className={style['label-price']}>
              $
              {(gallery?.price || 0).toFixed(2)}
            </div>
          </span>
        )}
        <div className={style['gallery-thumb']}>
          <ImageWithFallback
            options={{
              width: 500,
              height: 500,
              quality: 70,
              sizes: '(max-width: 768px) 30vw, (max-width: 2100px) 20vw',
              className: style['card-bg'],
              style: { filter: !canView ? 'blur(20px)' : 'blur(0px)' }
            }}
            alt="thumb"
            src={thumbUrl}
            fallbackSrc="/no-image.jpg"
          />
          <div className={style['gallery-stats']}>
            <a>
              <PictureOutlined />
              {' '}
              {gallery?.numOfItems || 0}
            </a>
            <a>
              <EyeOutlined />
              {' '}
              {gallery?.stats?.views || 0}
            </a>
          </div>
          <div className={style['lock-middle']}>
            {canView || isHovered ? <UnlockOutlined /> : <LockOutlined />}
          </div>
        </div>
        <Tooltip title={gallery?.title}>
          <div className={style['gallery-info']}>
            {gallery.title}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
}
export default GalleryCard;
