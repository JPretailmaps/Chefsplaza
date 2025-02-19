import {
  Modal
} from 'antd';
import dynamic from 'next/dynamic';

import style from './video-player-view.module.scss';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });

interface IProps {
  src: string;
  isOpenVideoPlayer: boolean;
  handleCancel: Function;
  title: string;
  width?: number
}

function VideoPlayerViewModal({
  src,
  isOpenVideoPlayer,
  handleCancel,
  title,
  width
}: IProps) {
  return (
    <Modal
      title={title}
      open={isOpenVideoPlayer}
      onCancel={() => handleCancel()}
      width={width}
      destroyOnClose
      footer={null}
      centered
      className={style['modal-view-video']}
    >
      <VideoPlayer
        options={{
          autoplay: true,
          controls: true,
          playsinline: true,
          fluid: true,
          sources: [
            {
              src,
              type: 'video/mp4'
            }
          ]
        }}
      />
    </Modal>
  );
}
VideoPlayerViewModal.defaultProps = {
  width: 500
};
export default VideoPlayerViewModal;
