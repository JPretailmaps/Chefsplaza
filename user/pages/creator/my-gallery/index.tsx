import { PictureOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const PerformerGalleriesList = dynamic(() => import('@components/performer/list/performer-gallery-list'));

function GalleryListingPage() {
  return (
    <>
      <SeoMetaHead pageTitle="My Galleries" />
      <div className="main-container">
        <PageHeading title="My Galleries" icon={<PictureOutlined />} />
        <PerformerGalleriesList />
      </div>
    </>
  );
}

GalleryListingPage.authenticate = true;

GalleryListingPage.onlyPerformer = true;

export default GalleryListingPage;
