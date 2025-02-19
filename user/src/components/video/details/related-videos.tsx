import { videoService } from '@services/video.service';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { RelatedListVideo } from '../related-list';

type Props = {
  videoId: string;
  performerId?: string;
  limit?: number;
};

function RelatedVideos({
  videoId,
  performerId,
  limit = 12
}: Props) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadVideos = async () => {
    try {
      // TODO - recheck and set timeout here
      setLoading(true);
      const query = {
        excludedId: videoId,
        limit
      } as any;
      if (performerId) query.performerId = performerId;
      const res = await videoService.userSearch(query);
      setVideos(res.data.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [videoId]);

  if (loading) return <div className="text-center"><Spin /></div>;
  if (!videos.length) return <p>No video was found</p>;
  return <RelatedListVideo videos={videos} />;
}

export default RelatedVideos;
