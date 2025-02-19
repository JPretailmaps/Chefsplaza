import { ShopOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerProductsList = dynamic(() => import('@components/performer/list/performer-store-list'));

function Products() {
  return (
    <>
      <SeoMetaHead pageTitle="My Products" />
      <div className="main-container">
        <PageHeading title="My Products" icon={<ShopOutlined />} />
        <PerformerProductsList />
      </div>
    </>
  );
}

Products.authenticate = true;

Products.onlyPerformer = true;

export default Products;
