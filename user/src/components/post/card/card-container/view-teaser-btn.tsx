import { IFile } from '@interfaces/file';
import { Button, Modal } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });

type P = {
  teaser: IFile
}

function ViewTeaserBtn({
  teaser
}: P) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button className="teaser-btn" type="link" onClick={() => setOpenModal(true)}>
        View teaser
      </Button>
      {openModal && (
      <Modal
        key="teaser_video"
        title="Teaser video"
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        width={650}
        destroyOnClose
        className="modal-teaser-preview"
      >
        <VideoPlayer
          key={teaser?._id}
          options={{
            autoplay: true,
            controls: true,
            playsinline: true,
            fluid: true,
            sources: [
              {
                src: teaser?.url,
                type: 'video/mp4'
              }
            ]
          }}
        />
      </Modal>
      )}
    </>
  );
}

export default ViewTeaserBtn;
