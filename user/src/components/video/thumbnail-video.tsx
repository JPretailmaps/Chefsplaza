import { ImageWithFallback } from '@components/common';
import { IVideo } from 'src/interfaces';

interface IProps {
  video: IVideo;
  style?: any;
}

export function ThumbnailVideo({ video: videoProp, style }: IProps) {
  const { thumbnail, video, teaser } = videoProp;
  const url = (thumbnail?.thumbnails && thumbnail?.thumbnails[0]) || (teaser?.thumbnails && teaser?.thumbnails[0]) || (video?.thumbnails && video?.thumbnails[0]) || '/no-image.jpg';
  return (
    <ImageWithFallback
      options={{
        width: 50,
        height: 50,
        style: style || { height: 50, width: 'auto' }
      }}
      alt="thumbnail"
      src={url}
    />
  );
}
