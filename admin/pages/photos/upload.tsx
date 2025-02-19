import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { FormUploadPhoto } from '@components/photo/form-upload-photo';
import Head from 'next/head';

function UploadPhoto() {
  return (
    <>
      <Head>
        <title>Upload photo</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Photos', href: '/photos' }, { title: 'Upload new photo' }]} />
      <Page>
        <FormUploadPhoto />
      </Page>
    </>
  );
}

export default UploadPhoto;
