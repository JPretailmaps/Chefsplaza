import Head from 'next/head';
import Page from '@components/common/layout/page';
import { BreadcrumbComponent } from '@components/common';
import { FormUploadBanner } from '@components/banner/form-upload-banner';

function UploadBanner() {
  return (
    <>
      <Head>
        <title>Upload banner</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Banners', href: '/banners' }, { title: 'New banner' }]} />
      <Page>
        <FormUploadBanner />
      </Page>
    </>
  );
}

export default UploadBanner;
