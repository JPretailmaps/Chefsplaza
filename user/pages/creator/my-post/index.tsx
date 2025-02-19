import { FireOutlined, PlusCircleOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PerformerPostListing = dynamic(() => import('@components/performer/list/performer-post-list'));

function PostListing() {
  return (
    <>
      <SeoMetaHead pageTitle="My Posts" />
      <div className="main-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <PageHeading title="My Posts" icon={<FireOutlined />} />
          <Link href="/creator/my-post/create">
            <PlusCircleOutlined />
            {' '}
            New Post
          </Link>
        </div>
        <PerformerPostListing />
      </div>
    </>
  );
}

PostListing.authenticate = true;
PostListing.onlyPerformer = true;

export default PostListing;
