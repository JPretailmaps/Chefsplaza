import Head from 'next/head';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { galleryService } from '@services/gallery.service';
import { FormGallery } from '@components/gallery/form-gallery';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';
import { useState } from 'react';
import { showError } from '@lib/message';

function GalleryCreate() {
  const [submiting, setSubmiting] = useState(false);

  const submit = async (data: any) => {
    try {
      setSubmiting(true);
      await galleryService.create(data);
      message.success('Created successfully');
      Router.push('/gallery');
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <>
      <Head>
        <title>New gallery</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[{ title: 'Galleries', href: '/gallery' }, { title: 'New gallery' }]}
      />
      <Page>
        <FormGallery onFinish={submit} submiting={submiting} />
      </Page>
    </>
  );
}

export default GalleryCreate;
