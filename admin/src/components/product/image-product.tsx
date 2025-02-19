import { IProduct } from 'src/interfaces';

interface IProps {
  product?: IProduct;
  style?: Record<string, string>;
}

export function ImageProduct({ product, style }: IProps) {
  const { image } = product;
  const url = image || '/product.png';
  return <img src={url} style={style || { width: 50 }} alt="thumb-prod" />;
}
