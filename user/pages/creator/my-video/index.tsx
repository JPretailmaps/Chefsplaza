import { VideoCameraOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerVideosList = dynamic(() => import('@components/performer/list/performer-video-list'));

function Videos() {
  return (
    <>
      <SeoMetaHead pageTitle="My Videos" />
      <div className="main-container">
        <PageHeading title="My Videos" icon={<VideoCameraOutlined />} />
        <PerformerVideosList />
      </div>
    </>
  );
}

Videos.authenticate = true;

Videos.onlyPerformer = true;

export default Videos;
