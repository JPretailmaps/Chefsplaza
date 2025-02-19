import { IPhotos } from 'src/interfaces';
import classNames from 'classnames';
import { useViewPopup } from 'src/context/view-media-popup/view-media-popup-container';
import { ImageWithFallback } from '@components/common';
import style from './photo-preview-list.module.scss';

interface IProps {
  photos: IPhotos[];
  isBlur: boolean;
}

function PhotoPreviewList({
  photos, isBlur
}: IProps) {
  const { showPopup } = useViewPopup();
  return (
    <div className={classNames(style['list-photos'], {
      [style.blur]: isBlur
    })}
    >
      {photos.map((item, index) => (
        <ImageWithFallback
          onClick={() => {
            showPopup(photos.map((p) => ({ ...p.photo, type: 'photo' })), index);
          }}
          key={item._id}
          options={{
            quality: 80,
            width: 200,
            height: 200,
            className: `${style['photo-img']} ${isBlur ? [style.disabled] : ''}`
          }}
          alt="gallery-photo"
          fallbackSrc="/no-image.jpg"
          src={(isBlur ? (item?.photo?.thumbnails && item?.photo?.thumbnails[0]) : item?.photo?.url) || '/no-image.jpg'}
        />
      ))}
    </div>
  );
}
export default PhotoPreviewList;
