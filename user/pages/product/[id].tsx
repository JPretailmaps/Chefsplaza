import SeoMetaHead from '@components/common/seo-meta-head';
import {
  productService
} from '@services/index'; import { IProduct } from 'src/interfaces';
import nextCookie from 'next-cookies';
import ProductDetailsWrapper from '@components/product/details/product-details-wrapper';
import { NextPageContext } from 'next/types';

interface IProps {
  product: IProduct;
}

function ProductViewPage({
  product
}: IProps) {
  return (
    <>
      <SeoMetaHead item={product} />
      <ProductDetailsWrapper product={product} />
    </>
  );
}

ProductViewPage.getInitialProps = async (ctx: NextPageContext) => {
  try {
    const { query } = ctx;
    const { token } = nextCookie(ctx);
    const product = await productService.userView(`${query.id}`, {
      Authorization: token || ''
    });
    return {
      product: product.data
    };
  } catch {
    return { notFound: true };
  }
};

export default ProductViewPage;
