import Head from 'next/head';
import Page from '@components/common/layout/page';
import { bannerService } from '@services/banner.service';
import { IBanner } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common';
import { FormUploadBanner } from '@components/banner/form-upload-banner';

interface IProps {
  banner: IBanner;
}
function BannerUpdate({ banner }: IProps) {
  return (
    <>
      <Head>
        <title>Update Banner</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Banners', href: '/banners' },
          { title: banner.title ? banner.title : 'Detail banner' },
          { title: 'Update' }
        ]}
      />
      <Page>
        <FormUploadBanner banner={banner} />
      </Page>
    </>
  );
}

BannerUpdate.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const resp = await bannerService.findById(id);
  return {
    banner: resp.data
  };
};

export default BannerUpdate;
