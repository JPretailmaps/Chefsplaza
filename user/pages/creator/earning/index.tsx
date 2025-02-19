import { DollarOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerEarningList = dynamic(() => import('@components/performer/list/performer-earning-list'));

function EarningPage() {
  return (
    <>
      <SeoMetaHead pageTitle="Earnings" />
      <div className="main-container">
        <PageHeading icon={<DollarOutlined />} title="Earnings" />
        <PerformerEarningList />
      </div>
    </>
  );
}

EarningPage.authenticate = true;

export default EarningPage;
