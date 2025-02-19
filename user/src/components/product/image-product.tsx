import { IProduct } from 'src/interfaces';

interface IProps {
  product?: IProduct;
  style?: Record<string, string>;
}

export function ImageProduct({ product, style }: IProps) {
  const url = product?.image || '/no-image.jpg';
  return <img alt="" src={url} style={style || { width: 50, borderRadius: 3 }} />;
}
