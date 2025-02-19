import { Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { productService } from '@services/product.service';
import { IProduct } from '@interfaces/product';
import { ProductCard } from '../product-card';

type Props = {
  productId: string;
  performerId?: string;
};

function RelatedProducts({
  productId,
  performerId = null
}: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const query = {
        excludedId: productId,
        status: 'active',
        limit: 24
      } as any;
      if (performerId) query.performerId = performerId;
      const res = await productService.userSearch(query);
      setItems(res.data.data);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [productId]);

  if (loading) return <div className="text-center"><Spin /></div>;
  if (!items.length) return <p>No product was found</p>;
  return (
    <Row>
      {items.map((item: IProduct) => (
        <Col xs={12} sm={12} md={6} lg={6} key={item._id}>
          <ProductCard
            product={item}
          />
        </Col>
      ))}
    </Row>
  );
}

export default RelatedProducts;
