import { useState } from 'react';
import Image from 'next/image';
import { shimmer, toBase64 } from '@lib/file';
import style from './MessageImageBlurBgWithFallback.module.scss';

interface IProps {
  options: any;
  src: string;
  fallbackSrc?: string;
  handleViewPopup?: Function;
}

function MessageImageBlurBgWithFallback(props: IProps) {
  const {
    src, fallbackSrc = '/no-image.jpg', options,
    handleViewPopup
  } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div
      aria-hidden
      className={style['bg-content']}
      onClick={() => handleViewPopup()}
    >
      <div className={style['main-content']} style={options.style}>
        <Image
          width={256}
          height={256}
          unoptimized
          {...options}
          src={imgSrc}
          placeholder="blur"
          sizes="20vw"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(options?.width, options?.height))}`}
          onError={() => {
            setImgSrc(fallbackSrc);
          }}
        />
      </div>
    </div>
  );
}

MessageImageBlurBgWithFallback.defaultProps = {
  fallbackSrc: '/no-image.jpg',
  handleViewPopup: () => { }
};

export default MessageImageBlurBgWithFallback;
