import {
  BookOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import dynamic from 'next/dynamic';
import SeoMetaHead from '@components/common/seo-meta-head';
import style from './bookmarks.module.scss';

const BookmarkTabs = dynamic(() => import('@components/performer/tabs/bookmarksTabs'));

function FavoriteVideoPage() {
  return (
    <>
      <SeoMetaHead pageTitle="Bookmarks" />
      <div className="main-container">
        <PageHeading title="Bookmarks" icon={<BookOutlined />} />
        <div className={style['user-account']}>
          <BookmarkTabs />
        </div>
      </div>
    </>
  );
}

FavoriteVideoPage.authenticate = true;

export default FavoriteVideoPage;
