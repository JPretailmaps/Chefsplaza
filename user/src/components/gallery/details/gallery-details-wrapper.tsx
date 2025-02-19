import {
  CalendarOutlined, EyeOutlined, PictureOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import {
  skeletonLoading, formatDate, shortenLargeNumber
} from '@lib/index';
import {
  Tabs
} from 'antd';
import {
  IGallery, IPhotos, IUser
} from 'src/interfaces';
import dynamic from 'next/dynamic';
import PerformerAvatar from '@components/performer/common/performer-avatar';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import classNames from 'classnames';
import style from './gallery-details-wrapper.module.scss';

const RelatedGalleries = dynamic(() => import('./related-galleries'), { ssr: false, loading: skeletonLoading });
const SubscribeButtons = dynamic(() => import('@components/performer/buttons/subscribe-buttons'));
const BookmarkButton = dynamic(() => import('@components/action-buttons/bookmark-button'));
const PurchaseGalleryBtn = dynamic(() => import('./purchase-gallery-btn'));
const PhotoPreviewList = dynamic(() => import('@components/photo/photo-preview-list'), { ssr: false, loading: skeletonLoading });
const ViewMediaPopupContainer = dynamic(() => import('src/context/view-media-popup/view-media-popup-container'), { ssr: false });

type Props = {
  gallery: IGallery;
  photos: IPhotos[];
  relatedGalleries: IGallery[];
};

function GalleryDetailsWrapper({
  gallery, relatedGalleries, photos
}: Props) {
  const user = useSelector((state: any) => state.user.current) as IUser;
  const viewable = (gallery.isSale && gallery.isBought) || (!gallery.isSale && gallery.isSubscribed) || user?._id === gallery?.performerId;

  return (
    <>
      <div className="main-container">
        <PageHeading icon={<PictureOutlined />} title={gallery?.title || 'Gallery'} />
        <div className={style['gal-stats']}>
          <span>
            <EyeOutlined />
            &nbsp;
            {shortenLargeNumber(gallery?.stats.views || 0)}
          </span>
          <span>
            <CalendarOutlined />
            &nbsp;
            {formatDate(gallery?.updatedAt, 'll')}
          </span>
        </div>
        <div className={style['photo-grid']}>
          {photos && photos.length > 0 && (
            <ViewMediaPopupContainer>
              <PhotoPreviewList
                isBlur={!user?._id || !viewable}
                photos={photos.map((p) => ({ ...p, type: 'photo' }))}
              />
            </ViewMediaPopupContainer>
          )}
          {!viewable && (
            <div className="text-center" style={{ margin: '20px 0' }}>
              {gallery?.isSale && !gallery?.isBought && (
                <PurchaseGalleryBtn
                  gallery={gallery}
                  onSuccess={() => Router.push({}, `/gallery/${gallery?.slug || gallery?._id}`, { shallow: false, scroll: true })}
                />
              )}
              {!gallery?.isSale && !gallery?.isSubscribed && (
                <div
                  style={{ padding: '25px 5px' }}
                  className={style.subscription}
                >
                  <h3>Subscribe to view full content</h3>
                  <SubscribeButtons performer={gallery?.performer} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="main-container">
        <div className={classNames(
          style['page-middle']
        )}
        >
          <PerformerAvatar performer={gallery?.performer} />
          <BookmarkButton objectId={gallery?._id} objectType="gallery" bookmarked={gallery?.isBookMarked} />
        </div>
      </div>
      <div className="main-container">
        <Tabs
          defaultActiveKey="description"
        >
          <Tabs.TabPane tab="Description" key="description">
            <p>{gallery?.description || 'No description...'}</p>
          </Tabs.TabPane>
        </Tabs>
        <div className={style['related-items']}>
          <h4 className={style['r-title']}>You may also like</h4>
          <RelatedGalleries galleries={relatedGalleries} />
        </div>
      </div>
    </>
  );
}

export default GalleryDetailsWrapper;
