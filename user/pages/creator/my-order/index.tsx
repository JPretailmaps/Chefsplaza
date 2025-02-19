import { ShoppingCartOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerOrderList = dynamic(() => import('@components/performer/list/performer-order-list'));

function ModelOrderPage() {
  return (
    <>
      <SeoMetaHead pageTitle="My Orders" />
      <div className="main-container">
        <PageHeading title="My Orders" icon={<ShoppingCartOutlined />} />
        <PerformerOrderList />
      </div>
    </>
  );
}

ModelOrderPage.authenticate = true;

ModelOrderPage.onlyPerformer = true;

export default ModelOrderPage;
