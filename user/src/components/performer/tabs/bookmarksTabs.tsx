import {
  FireOutlined, PictureOutlined, ShopOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import {
  Tabs
} from 'antd';
import { useState } from 'react';
import { ModelIcon } from 'src/icons';

import dynamic from 'next/dynamic';
import { skeletonLoading } from '@lib/loading';
import style from './tabs.module.scss';

const ScrollListFeeds = dynamic(() => (import('@components/post/list/scroll-list')));
const ScrollListVideo = dynamic(() => (import('@components/video/scroll-list-item')), { ssr: false, loading: skeletonLoading });
const ScrollListGallery = dynamic(() => (import('@components/gallery/scroll-list-gallery')), { ssr: false, loading: skeletonLoading });
const ScrollListProduct = dynamic(() => (import('@components/product/scroll-list-item')), { ssr: false, loading: skeletonLoading });
const ScrollListPerformers = dynamic(() => (import('@components/performer/list/scroll-list')), { ssr: false, loading: skeletonLoading });

function FavoriteVideoTabs() {
  const [totalFeeds, setTotalFeeds] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalGalleries, setTotalGalleries] = useState(0);
  const [totalPerformers, setTotalPerformers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  return (
    <div className={style.account_tabs}>
      <Tabs
        defaultActiveKey="feeds"
        size="large"
      >
        <Tabs.TabPane tab={<FireOutlined />} key="feeds">
          <div className={style['heading-tab']}>
            <h4>
              {totalFeeds > 0 && totalFeeds}
              {' '}
              {totalFeeds > 1 ? 'POSTS' : 'POST'}
            </h4>
          </div>
          <ScrollListFeeds query={{}} isBookmark getTotal={(t) => setTotalFeeds(t)} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<VideoCameraOutlined />} key="videos">
          <div className={style['heading-tab']}>
            <h4>
              {totalVideos > 0 && totalVideos}
              {' '}
              {totalVideos > 1 ? 'VIDEOS' : 'VIDEO'}
            </h4>
          </div>
          <ScrollListVideo
            getTotal={(t) => setTotalVideos(t)}
            isBookmark
            query={{}}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<PictureOutlined />} key="galleries">
          <div className={style['heading-tab']}>
            <h4>
              {totalGalleries > 0 && totalGalleries}
              {' '}
              {totalGalleries > 1 ? 'GALLERIES' : 'GALLERY'}
            </h4>
          </div>
          <ScrollListGallery
            getTotal={(t) => setTotalGalleries(t)}
            isBookmark
            query={{}}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<ShopOutlined />} key="products">
          <div className={style['heading-tab']}>
            <h4>
              {totalProducts > 0 && totalProducts}
              {' '}
              {totalProducts > 1 ? 'PRODUCTS' : 'PRODUCT'}
            </h4>
          </div>
          <ScrollListProduct
            getTotal={(t) => setTotalProducts(t)}
            isBookmark
            query={{}}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<ModelIcon />} key="performers">
          <div className={style['heading-tab']}>
            <h4>
              {totalPerformers > 0 && totalPerformers}
              {' '}
              {totalPerformers > 1 ? 'CREATORS' : 'CREATOR'}
            </h4>
          </div>
          <ScrollListPerformers
            getTotal={(t) => setTotalPerformers(t)}
            isBookmark
            query={{}}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default FavoriteVideoTabs;
