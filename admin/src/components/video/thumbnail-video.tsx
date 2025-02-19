import Image from 'next/image';
import { IVideo } from 'src/interfaces';

interface IProps {
  video?: IVideo;
  style?: Record<string, string>;
}

export function ThumbnailVideo({ video, style }: IProps) {
  const { thumbnail, video: media } = video;
  const url = (media?.thumbnails && media?.thumbnails[0]) || (thumbnail?.thumbnails && thumbnail?.thumbnails[0]) || '/no-image.jpg';
  return (
    <Image
      loading="lazy"
      width={50}
      height={50}
      alt="thumb"
      src={url}
      style={style || { width: 'auto' }}
    />
  );
}

ThumbnailVideo.defaultProps = {
  style: {
    with: 50, objectFit: 'cover', borderRadius: 3
  }
};
