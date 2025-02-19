import { IPerformer } from '@interfaces/performer';
import { Button, Modal } from 'antd';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });

type Props = {
  performer: IPerformer
};

function ModalWelcomeVideo({
  performer
}: Props) {
  const [show, setShow] = useState(false);

  const handleViewWelcomeVideo = () => {
    const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos');
    if (!notShownWelcomeVideos?.includes(performer._id)) {
      const Ids = JSON.parse(notShownWelcomeVideos || '[]');
      const values = Array.isArray(Ids) ? Ids.concat([performer._id]) : [performer._id];
      localStorage.setItem('notShownWelcomeVideos', JSON.stringify(values));
    }
    setShow(false);
  };

  useEffect(() => {
    const notShownWelcomeVideos = localStorage.getItem('notShownWelcomeVideos') || '[]';
    if (!JSON.parse(notShownWelcomeVideos).includes(performer._id)) {
      setShow(true);
    }
  }, [performer]);

  if (!show || !performer.welcomeVideoPath || !performer.activateWelcomeVideo) return null;

  return (
    <Modal
      key="welcome-video"
      className="welcome-video"
      destroyOnClose
      closable={false}
      maskClosable={false}
      width={767}
      open
      title={null}
      centered
      onCancel={() => setShow(false)}
      footer={[
        <Button
          key="close"
          className="secondary"
          onClick={() => setShow(false)}
        >
          Close
        </Button>,
        <Button
          key="not-show"
          className="primary"
          onClick={() => handleViewWelcomeVideo()}
        >
          Don&apos;t show this again
        </Button>
      ]}
    >
      <VideoPlayer options={{
        key: `${performer._id}`,
        controls: true,
        playsinline: true,
        fluid: true,
        autoplay: true,
        sources: [
          {
            src: performer.welcomeVideoPath,
            type: 'video/mp4'
          }
        ]
      }}
      />
    </Modal>
  );
}

export default ModalWelcomeVideo;
