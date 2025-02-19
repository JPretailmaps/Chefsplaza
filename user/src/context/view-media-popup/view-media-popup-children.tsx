/* eslint-disable no-nested-ternary */
import Video from 'yet-another-react-lightbox/plugins/video';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Download from 'yet-another-react-lightbox/plugins/download';
import { convertHtml } from '@lib/string';
import { useViewPopup } from './view-media-popup-container';
import ImageLightBox from './image-light-box';

import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

function ViewMediaPopupChildren() {
  const {
    show, closePopup, content, index
  } = useViewPopup();
  if (!show || !content.length) return null;
  const slides = content.map((d: any) => ((d?.type || d?.mimeType || '').includes('photo') || (d?.type || d?.mimeType || '').includes('image') ? (
    // get file photo
    {
      src: d?.url || '/no-image.jpg',
      width: d?.width || 1024,
      height: d?.height || 1024,
      // title: d.title || '',
      description: convertHtml(d.description || '')
    }
  ) : ((d?.type || d?.mimeType || null).includes('video') ? (
    // get file video
    {
      type: 'video',
      width: d?.width || 1920,
      height: d?.height || 1080,
      autoPlay: true,
      disablePictureInPicture: true,
      controls: true,
      // title: d.title || '',
      description: convertHtml(d.description || ''),
      poster: (d?.thumbnails && d?.thumbnails[0]) || '/no-image.jpg',
      sources: [
        {
          src: d?.url || '/no-image.jpg',
          type: 'video/mp4'
        }
      ]
    }
  ) : null)));

  return (
    <Lightbox
      open={show}
      index={index}
      close={closePopup}
      slides={slides}
      render={{ slide: ImageLightBox }}
      plugins={[
        Zoom, Video, Thumbnails, Captions, Counter, Download, Fullscreen
      ]}
      animation={{ zoom: 1000 }}
      zoom={{
        maxZoomPixelRatio: 100,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        keyboardMoveDistance: 50,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
        scrollToZoom: true
      }}
      captions={{
        showToggle: false,
        descriptionTextAlign: 'center',
        descriptionMaxLines: 2
      }}
      carousel={{ preload: slides.length > 3 ? 2 : 1 }}
      thumbnails={{
        position: 'bottom',
        width: 120,
        height: 80
      }}
    />
  );
}

export default ViewMediaPopupChildren;
