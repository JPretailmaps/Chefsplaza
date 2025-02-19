import { BlockOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerBlockList = dynamic(() => import('@components/performer/list/performer-block-user-list'));

function BlockPage() {
  return (
    <>
      <SeoMetaHead pageTitle="Blacklist" />
      <div className="main-container">
        <PageHeading icon={<BlockOutlined />} title="Blacklist" />
        <PerformerBlockList />
      </div>
    </>
  );
}

BlockPage.onlyPerformer = true;
BlockPage.authenticate = true;

export default BlockPage;
