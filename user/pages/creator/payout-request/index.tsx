import { NotificationOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerPayoutRequestList = dynamic(() => import('@components/performer/list/performer-payout-repuest-list'));

function PerformerPayoutRequestPage() {
  return (
    <>
      <SeoMetaHead pageTitle="Payout Requests" />
      <div className="main-container">
        <PageHeading title="Payout Requests" icon={<NotificationOutlined />} />
        <PerformerPayoutRequestList />
      </div>
    </>
  );
}

PerformerPayoutRequestPage.onlyPerformer = true;

export default PerformerPayoutRequestPage;
