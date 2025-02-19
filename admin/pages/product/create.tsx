import Head from 'next/head';
import Page from '@components/common/layout/page';
import { BreadcrumbComponent } from '@components/common';
import { FormProduct } from '@components/product/form-product';

function CreateProduct() {
  return (
    <>
      <Head>
        <title>New product</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Product', href: '/product' },
          { title: 'New product' }
        ]}
      />
      <Page>
        <FormProduct
          product={null}
        />
      </Page>
    </>
  );
}

export default CreateProduct;
