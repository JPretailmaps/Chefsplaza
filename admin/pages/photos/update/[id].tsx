import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { FormUploadPhoto } from '@components/photo/form-upload-photo';
import { photoService } from '@services/photo.service';
import Head from 'next/head';
import nextCookie from 'next-cookies';
import { NextPageContext } from 'next/types';
import { IPhoto } from 'src/interfaces';

interface IProps {
  photo: IPhoto
}
function PhotoUpdate({ photo }: IProps) {
  return (
    <>
      <Head>
        <title>Update Photo</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Photos', href: '/photos' },
          { title: photo.title ? photo.title : 'Detail photo' },
          { title: 'Update' }
        ]}
      />
      <Page>
        <FormUploadPhoto
          photo={photo}
        />
      </Page>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);
  const resp = await photoService.findById(`${id}`, {
    Authorization: token || ''
  });
  return {
    props: {
      photo: resp.data
    }
  };
};

export default PhotoUpdate;
