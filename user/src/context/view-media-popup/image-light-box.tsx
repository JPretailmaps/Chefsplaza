import Image from 'next/image';
import { isImageFitCover, isImageSlide, useLightboxProps } from 'yet-another-react-lightbox';

function isNextJsImage(slide) {
  return isImageSlide(slide) && typeof slide.width === 'number' && typeof slide.height === 'number';
}

type P = {
  slide: any;
  rect: any;
}

export default function ImageLightBox({ slide, rect }: P) {
  const { imageFit } = useLightboxProps().carousel;
  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isNextJsImage(slide)) return undefined;

  const width = !cover ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width)) : rect.width;

  const height = !cover ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height)) : rect.height;

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        fill
        alt="preview-img"
        src={slide}
        loading="lazy"
        draggable={false}
        placeholder={slide.blurDataURL ? 'blur' : undefined}
        style={{ objectFit: cover ? 'cover' : 'contain' }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
      />
    </div>
  );
}
