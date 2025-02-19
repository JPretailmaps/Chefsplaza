import Head from 'next/head';
import Page from '@components/common/layout/page';
import { IProduct } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common';
import { FormProduct } from '@components/product/form-product';
import { NextPageContext } from 'next/types';
import nextCookie from 'next-cookies';
import { productService } from '@services/product.service';

interface IProps {
  product: IProduct;
}

function ProductUpdate({ product }: IProps) {
  return (
    <>
      <Head>
        <title>Update Product</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Product', href: '/product' },
          { title: product.name ? product.name : 'Detail product' },
          { title: 'Update' }
        ]}
      />
      <Page>
        <FormProduct
          product={product}
        />
      </Page>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);

  const resp = await productService.findById(`${id}`, {
    Authorization: token || ''
  });

  return {
    props: {
      gallery: resp.data
    }
  };
};

export default ProductUpdate;
