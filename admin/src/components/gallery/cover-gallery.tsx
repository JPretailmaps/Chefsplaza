import Image from 'next/image';
import { IGallery } from 'src/interfaces';

interface IProps {
  gallery: IGallery;
  style?: Record<string, string>;
}

export function CoverGallery({ gallery, style }: IProps) {
  const { coverPhoto } = gallery;
  const url = coverPhoto?.thumbnails[0] || '/no-image.jpg';
  return (
    <Image
      unoptimized
      width={60}
      height={60}
      sizes="20vw"
      src={url}
      style={style}
      alt="style"
    />
  );
}

CoverGallery.defaultProps = {
  style: {
    with: 50, objectFit: 'cover', borderRadius: 3
  }
};
