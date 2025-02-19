import { Row, Col } from 'antd';

interface P {
  limit: number;
  active: boolean;
  style?: any;
}

export function LoadingGridItems({ limit, active, style }: P) {
  if (!active) return null;

  const listLoading = Array.from({ length: limit }).map((_, i) => ({
    key: `skeleton_loading_${i + 1}`
  }));

  return (
    <Row>
      {listLoading.map((item) => (
        <Col xs={24} sm={12} md={6} key={item.key}>
          <div className="skeleton-loading" style={style} />
        </Col>
      ))}
    </Row>
  );
}

LoadingGridItems.defaultProps = {
  style: { height: 360 }
};
