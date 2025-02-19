import { IGallery } from 'src/interfaces';

interface IProps {
  gallery?: IGallery;
  style?: Record<string, string>;
}

export function CoverGallery({ gallery, style }: IProps) {
  const url = gallery?.coverPhoto?.thumbnails ? gallery?.coverPhoto?.thumbnails[0]
    : '/no-image.jpg';
  return (
    <img
      alt="Cover"
      src={url}
      style={style || { width: 50, borderRadius: '3px' }}
    />
  );
}
