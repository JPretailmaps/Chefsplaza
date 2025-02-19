import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  bannerService
} from '@services/index';
import {
  Alert, Button, Input
} from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { connect } from 'react-redux';
import {
  IBanner, ISettings, IUser
} from 'src/interfaces';
import SeoMetaHead from '@components/common/seo-meta-head';
import { skeletonLoading } from '@lib/loading';

import style from './home.module.scss';

const Banners = dynamic(() => import('@components/common/banner'));
const HomePerformers = dynamic(() => import('@components/performer/list/home-listing'));
const StreamActiveItems = dynamic(() => import('@components/streaming/list/active-list-items'));
const ScrollListFeed = dynamic(() => import('@components/post/list/scroll-list'), { ssr: false, loading: skeletonLoading });

interface IProps {
  banners: IBanner[];
  settings: ISettings;
  user: IUser;
}

function HomePage({
  user, settings, banners
}: IProps) {
  const [keyword, setKeyword] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [totalFeeds, setTotalFeeds] = useState(0);
  const [feedType, setFeedType] = useState('');

  const onSearchFeed = debounce(async (e) => {
    setKeyword(e);
  }, 600);

  const topBanners = banners && banners.length > 0 && banners.filter((b) => b.position === 'top');

  return (
    <>
      <SeoMetaHead pageTitle="Home" />
      <div className={classNames(
        style['home-page']
      )}
      >
        <Banners banners={topBanners} />
        <div className="main-container">
          <div className={style['home-heading']}>
            <div className={style['left-side']}>
              <h3>
                HOME
              </h3>
            </div>
            <div className={style['search-bar-feed']}>
              <Input
                className={openSearch ? style.active : ''}
                prefix={<SearchOutlined />}
                placeholder="Type to search here ..."
                onChange={(e) => {
                  e.persist();
                  onSearchFeed(e.target.value);
                }}
              />
              <a aria-hidden className={style['open-search']} onClick={() => setOpenSearch(!openSearch)}>
                {!openSearch ? <SearchOutlined /> : <CloseOutlined />}
              </a>
            </div>
          </div>
          <div className={style['home-container']}>
            <div className={style['left-container']}>
              {user._id && !user.verifiedEmail && settings.requireEmailVerification && <Link href={user.isPerformer ? '/creator/account' : '/user/account'}><Alert type="error" style={{ margin: '15px 0', textAlign: 'center' }} message="Please verify your email address, click here to update!" /></Link>}
              <StreamActiveItems />
              <div className={style['filter-wrapper']}>
                <Button className={classNames({ active: feedType === '' })} onClick={() => setFeedType('')}>All Posts</Button>
                <Button className={classNames({ active: feedType === 'text' })} onClick={() => setFeedType('text')}>Text</Button>
                <Button className={classNames({ active: feedType === 'video' })} onClick={() => setFeedType('video')}>Video</Button>
                <Button className={classNames({ active: feedType === 'photo' })} onClick={() => setFeedType('photo')}>Photos</Button>
                <Button className={classNames({ active: feedType === 'audio' })} onClick={() => setFeedType('audio')}>Audio</Button>
                <Button className={classNames({ active: feedType === 'scheduled-streaming' })} onClick={() => setFeedType('scheduled-streaming')}>Scheduled Streaming</Button>
              </div>
              {!totalFeeds && (
                <div className="main-container custom text-center" style={{ margin: '10px 0' }}>
                  <Alert
                    type="warning"
                    message={(
                      <Link href="/creator">
                        <SearchOutlined />
                        {' '}
                        Find someone to follow
                      </Link>
                    )}
                  />
                </div>
              )}
              <ScrollListFeed
                query={{
                  q: keyword,
                  isHome: true,
                  type: feedType
                }}
                getTotal={(t) => setTotalFeeds(t)}
              />
            </div>
            <div className={style['right-container']} id="home-right-container">
              <HomePerformers />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

HomePage.authenticate = true;
HomePage.noredirect = true;
HomePage.layout = 'home';

export const getServerSideProps = async () => {
  const [banners] = await Promise.all([
    bannerService.search({ limit: 99 })
  ]);
  return {
    props: {
      banners: banners?.data?.data || []
    }
  };
};

const mapStates = (state: any) => ({
  user: { ...state.user.current },
  settings: { ...state.settings }
});

const mapDispatch = {};
export default connect(mapStates, mapDispatch)(HomePage);
