import { Col, Row } from 'antd';
import { IVideo } from 'src/interfaces/video';

import { VideoCard } from './video-card';

interface IProps {
  videos: any;
}

export function RelatedListVideo({ videos }: IProps) {
  return (
    <Row>
      {videos.length > 0
        ? videos.map((video: IVideo) => (
          <Col xs={12} sm={12} md={6} lg={6} key={video._id}>
            <VideoCard video={video} />
          </Col>
        )) : <p>No video was found</p>}
    </Row>
  );
}
