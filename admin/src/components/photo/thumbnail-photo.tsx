import Image from 'next/image';
import { IPhoto } from 'src/interfaces';

interface IProps {
  photo: IPhoto;
  style?: Record<string, string>;
}

export function ThumbnailPhoto({ style, photo }: IProps) {
  const { photo: item } = photo;
  const urlThumb = item?.url || (item.thumbnails && item.thumbnails[0]) || '/no-image.jpg';
  return (
    <Image
      unoptimized
      loading="lazy"
      src={urlThumb}
      width={60}
      height={60}
      sizes="20vw"
      style={style}
      alt="thumb"
    />
  );
}

ThumbnailPhoto.defaultProps = {
  style: {
    with: 60, height: 60, objectFit: 'cover', borderRadius: 3
  }
};
