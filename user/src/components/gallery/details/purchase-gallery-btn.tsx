import { IGallery } from '@interfaces/gallery';
import { showError } from '@lib/utils';
import { tokenTransctionService } from '@services/token-transaction.service';
import { Button, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

const PurchaseGalleryForm = dynamic(() => import('../confirm-purchase'));

type Props = {
  gallery: IGallery;
  onSuccess?: Function;
}

function PurchaseGalleryBtn({
  gallery,
  onSuccess = () => {}
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const user = useSelector((state: any) => state.user.current);
  const router = useRouter();

  const purchaseGallery = async () => {
    try {
      if (user.balance < gallery.price) {
        message.error('You have an insufficient token balance. Please top up.');
        router.push('/wallet');
        return;
      }
      setRequesting(true);
      const res = await tokenTransctionService.purchaseGallery(gallery._id);
      message.success('Gallery is unlocked!');
      // TODO - update my logic
      // handleUpdateBalance({ token: -gallery.price });
      onSuccess(res.data);
      setRequesting(false);
      setOpenModal(false);
    } catch (e) {
      showError(e);
      setRequesting(false);
    }
  };

  return (
    <>
      <Button disabled={!user?._id || requesting} className="primary" onClick={() => setOpenModal(true)}>
        {`PAY ${(gallery.price || 0).toFixed(2)} TO UNLOCK`}
      </Button>
      {openModal && (
      <Modal
        centered
        key="purchase_gallery"
        title={null}
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
      >
        <PurchaseGalleryForm gallery={gallery} submiting={requesting} onFinish={purchaseGallery} />
      </Modal>
      )}
    </>
  );
}

PurchaseGalleryBtn.defaultProps = {
  onSuccess: () => {}
};

export default PurchaseGalleryBtn;
