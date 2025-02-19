import { UserAddOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerSubscriberList = dynamic(() => import('@components/performer/list/performer-subscription-list'));

function SubscriberPage() {
  return (
    <>
      <SeoMetaHead pageTitle="My Subscribers" />
      <div className="main-container">
        <PageHeading title="My Subscribers" icon={<UserAddOutlined />} />
        <PerformerSubscriberList />
      </div>
    </>
  );
}

SubscriberPage.authenticate = true;

SubscriberPage.onlyPerformer = true;

export default SubscriberPage;
