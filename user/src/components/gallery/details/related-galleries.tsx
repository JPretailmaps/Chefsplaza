import { IGallery } from '@interfaces/gallery';
import { Col, Row } from 'antd';
import GalleryCard from '../gallery-card';

type Props = {
  galleries: IGallery[];
};

function RelatedGalleries({
  galleries
}: Props) {
  if (!galleries.length) return <div>No related item was found.</div>;
  return (
    <Row>
      {galleries.map((item: IGallery) => (
        <Col xs={12} sm={12} md={6} lg={6} key={item._id}>
          <GalleryCard gallery={item} />
        </Col>
      ))}
    </Row>
  );
}

export default RelatedGalleries;
