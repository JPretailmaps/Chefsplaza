import {
  ShopOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import {
  Image
} from 'antd'; import {
  IProduct
} from 'src/interfaces';
import dynamic from 'next/dynamic';

import BookmarkButton from '@components/action-buttons/bookmark-button';
import PerformerAvatar from '@components/performer/common/performer-avatar';
import Price from '@components/common/price';

import classNames from 'classnames';
import { useSelector } from 'react-redux';
import style from './product-details-wrapper..module.scss';

const PurchaseProductBtn = dynamic(() => import('./purchase-product-btn'));
const RelatedProducts = dynamic(() => import('./related-products'));

type Props = {
  product: IProduct;
};

function ProductDetailsWrapper({
  product
}: Props) {
  return (
    <>
      <div className="main-container">
        <PageHeading title={product.name || 'N/A'} icon={<ShopOutlined />} />
        <div className={style['prod-card']}>
          <div className={style['prod-img']}>
            <Image
              alt="product-img"
              src={product.image || '/empty_product.svg'}
            />
            {product.stock && product.type === 'physical' ? (
              <span className={style['prod-stock']}>
                {product.stock}
                {' '}
                in stock
              </span>
            ) : null}
            {!product.stock && product.type === 'physical' && (
              <span className={style['prod-stock']}>Out of stock!</span>
            )}
            {product.type === 'digital' && <span className={style['prod-digital']}>Digital</span>}
          </div>
          <div className={style['prod-info']}>
            <p className={classNames(
              style['prod-desc']
            )}
            >
              {product.description || 'No description yet'}

            </p>
            <div className={style['add-cart']}>
              <p className={style['prod-price']}>
                <Price amount={product.price} />
              </p>
              <div>
                <PurchaseProductBtn product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="vid-split">
        <div className="main-container">
          <div className={classNames(
            style['prod-act']
          )}
          >
            <div className="o-w-ner">
              <PerformerAvatar performer={product.performer} />
            </div>
            <div className="act-btns">
              <BookmarkButton objectId={product._id} objectType="product" bookmarked={product.isBookMarked} />
            </div>
          </div>
        </div>
      </div>
      <div className="main-container">
        <div className="related-items">
          <h4 className="ttl-1">You may also like</h4>
          <RelatedProducts productId={product._id} performerId={product.performerId} />
        </div>
      </div>
    </>
  );
}

export default ProductDetailsWrapper;
