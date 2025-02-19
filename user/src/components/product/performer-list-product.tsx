import { Col, Row } from 'antd';
import { IProduct } from 'src/interfaces/product';

import { ProductCard } from './product-card';

interface IProps {
  products: IProduct[];
}

export function PerformerListProduct({ products }: IProps) {
  return (
    <Row>
      {products.length > 0
        && products.map((product: IProduct) => (
          <Col xs={12} sm={12} md={8} lg={6} key={product._id}>
            <ProductCard
              product={product}
            />
          </Col>
        ))}
    </Row>
  );
}
