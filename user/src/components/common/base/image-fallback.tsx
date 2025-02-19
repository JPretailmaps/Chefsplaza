import { shimmer, toBase64 } from '@lib/file';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IProps {
  options: any;
  src: string;
  alt: string;
  fallbackSrc?: string;
  onClick?: Function;
}

export function ImageWithFallback({
  src, alt, fallbackSrc, options, onClick
}: IProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const opts = {
    className: options?.classes,
    width: 100,
    height: 100,
    quality: 80,
    sizes: '(max-width: 767px) 90vw, (min-width: 768px) 50vw',
    ...options
  };

  return (
    <Image
      onClick={() => onClick && onClick()}
      alt={alt}
      src={imgSrc}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(options?.width, options?.height))}`}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      {...opts}
    />
  );
}

ImageWithFallback.defaultProps = {
  fallbackSrc: '/no-image.jpg',
  onClick: () => {}
};

export default ImageWithFallback;
