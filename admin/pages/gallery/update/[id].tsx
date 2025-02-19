import Head from 'next/head';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { galleryService } from '@services/gallery.service';
import { BreadcrumbComponent } from '@components/common';
import { FormGallery } from '@components/gallery/form-gallery';
import Router from 'next/router';
import { IGallery } from 'src/interfaces';
import { useState } from 'react';
import { showError } from '@lib/message';
import { NextPageContext } from 'next/types';
import nextCookie from 'next-cookies';

interface IProps {
  gallery: IGallery;
}

function GalleryUpdate({ gallery }: IProps) {
  const [submiting, setSubmiting] = useState(false);

  const submit = async (data: any) => {
    try {
      setSubmiting(true);
      await galleryService.update(gallery._id, data);
      message.success('Updated successfully');
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
        <title>Update Gallery</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Galleries', href: '/gallery' },
          { title: gallery?.title || 'Update Gallery' }
        ]}
      />
      <Page>
        <FormGallery
          gallery={gallery}
          onFinish={submit}
          submiting={submiting}
        />
      </Page>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);
  const resp = await galleryService.findById(`${id}`, {
    Authorization: token || ''
  });
  return {
    props: {
      gallery: resp.data
    }
  };
};

export default GalleryUpdate;
