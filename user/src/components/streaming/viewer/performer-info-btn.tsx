import { IPerformer } from '@interfaces/performer';
import { Modal } from 'antd';
import { useState } from 'react';
import { InfoIcon } from 'src/icons';
import { AboutPerformer } from '../../performer/profile/about-profile';

type Props = {
  performer: IPerformer;
};

export function PerformerInfoButton({
  performer
}: Props) {
  const [openModal, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        aria-hidden
      >
        <InfoIcon />
      </div>
      {openModal && (
        <Modal
          title="Bio"
          open={openModal}
          className="modal-bottom"
          footer={null}
          destroyOnClose
          centered
          onCancel={() => setOpen(false)}
        >
          <AboutPerformer performer={performer} defaultActiveKey={['1']} />
        </Modal>
      )}
    </>
  );
}

export default PerformerInfoButton;
