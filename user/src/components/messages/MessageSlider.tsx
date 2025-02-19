import dynamic from 'next/dynamic';
import { useViewPopup } from 'src/context/view-media-popup/view-media-popup-container';
import MessageImageBlurBgWithFallback from './MessageImageBlurBgWithFallback';
import style from './MessageSlider.module.scss';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });
const VideoStatusPlayer = dynamic(() => import('@components/video/player/video-player-with-file-status'), { ssr: false });
interface IProps {
  messageId: string;
  files: any;
}

function MessageMediaSlider({ files, messageId }: IProps) {
  const { showPopup } = useViewPopup();

  return files && files.length > 0 ? (
    <div className={style['message-slider']}>
      {files.map((f, index) => (
        [(f.type === 'message-photo') && (
          <MessageImageBlurBgWithFallback
            options={{
              quality: 60,
              width: 512,
              height: 512,
              alt: f._id
            }}
            fallbackSrc="/no-image.jpg"
            src={f?.url || '/no-image.jpg'}
            key={f._id || f.uid}
            handleViewPopup={() => showPopup(files, index)}
          />
        ),
        f.type === 'message-video' && (
          <div className={style['message-video-container']} key={f._id || f.uid}>
            <div className={style['message-video-content']}>
              {f.status === 'finished' ? (
                <VideoPlayer
                  options={{
                    autoplay: false,
                    controls: true,
                    playsinline: true,
                    fluid: false,
                    sources: [
                      {
                        src: f.url,
                        type: 'video/mp4'
                      }
                    ]
                  }}
                />
              ) : (
                <VideoStatusPlayer
                  target="messageId"
                  fileId={f._id}
                  targetId={messageId}
                  thumbUrl={f?.thumbnails && f?.thumbnails[0]}
                  options={{
                    autoplay: false,
                    controls: true,
                    playsinline: true,
                    fluid: false,
                    sources: [
                      {
                        src: f.url,
                        type: 'video/mp4'
                      }
                    ]
                  }}
                />
              )}
            </div>
          </div>
        )]
      ))}
    </div>
  ) : null;
}

export default MessageMediaSlider;
