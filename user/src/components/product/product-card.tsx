import { Tooltip } from 'antd';
import Link from 'next/link';
import { IProduct, IUIConfig } from 'src/interfaces';
import { ImageWithFallback } from '@components/common';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import style from './product-card.module.scss';

interface IProps {
  product: IProduct;
}

export function ProductCard({ product }: IProps) {
  return (
    <Link
      href={{ pathname: '/product/[id]', query: { id: product.slug || product._id } }}
      as={`/product/${product.slug || product._id}`}
    >
      <div className={classNames(style['prd-card'])}>
        <ImageWithFallback
          options={{
            size: 300,
            height: 300,
            className: style.thumbnail
          }}
          alt="thumb"
          src={product?.image || '/empty_product.svg'}
          fallbackSrc="/empty_product.svg"
        />
        <div className={style['label-wrapper']}>
          {product.price > 0 && (
          <span className={style['label-wrapper-price']}>
            $
            {(product?.price || 0).toFixed(2)}
          </span>
          )}
          {!product.stock && product.type === 'physical' && (
          <div className={style['label-wrapper-digital']}>Out of stock!</div>
          )}
          {product.stock > 0 && product.type === 'physical' && (
          <div className={style['label-wrapper-digital']}>
            {Math.round(product.stock)}
            {' '}
            in stock
          </div>
          )}
          {product.type === 'digital' && (
          <span className={style['label-wrapper-digital']}>Digital</span>
          )}
        </div>
        <Tooltip title={product.name}>
          <div className={style['prd-info']}>
            {product.name}
          </div>
        </Tooltip>
      </div>
    </Link>
  );
}

export default ProductCard;
