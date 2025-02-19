import {
  DollarOutlined
} from '@ant-design/icons';
import { showError } from '@lib/utils';
import { tokenTransctionService } from '@services/token-transaction.service';
import { Button, Modal, message } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IProduct } from '@interfaces/index';
import { updateBalance } from '@redux/user/actions';
import { PurchaseProductForm } from '../confirm-purchase';

type Props = {
  product: IProduct;
  onSuccess?: Function;
}

function PurchaseProductBtn({
  product,
  onSuccess = () => { }
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const loggedIn = useSelector((state: any) => state.auth.loggedIn);
  const user = useSelector((state: any) => state.user.current);
  const router = useRouter();
  const dispatch = useDispatch();

  const onClick = () => {
    if (!loggedIn) {
      message.error('Please log in or register!');
    }
    if (user.isPerformer) {
      message.error('Creators cannot purchase theirs own products!');
      return;
    }

    if (product.type === 'physical' && !product.stock) {
      message.error('Out of stock, please comeback later!');
      return;
    }

    if (user.balance < product.price) {
      message.error('You have an insufficient token balance. Please top up.');
      router.push('/wallet');
      return;
    }

    setOpenModal(true);
  };

  const purchaseProduct = async (payload) => {
    try {
      if (product.type === 'physical' && !payload.deliveryAddressId) {
        message.error('Please select or create new the delivery address!');
        return;
      }
      setRequesting(true);
      const res = await tokenTransctionService.purchaseProduct(product._id, payload);
      message.success('Payment success!');
      router.push('/user/orders');
      // TODO - update my logic
      dispatch(updateBalance({ token: -product.price }));
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
      <Button disabled={!loggedIn || requesting} className="primary" onClick={onClick}>
        <DollarOutlined />
        Get it now!
      </Button>
      {openModal && (
        <Modal
          key="purchase-product"
          width={660}
          title={null}
          open={openModal}
          onOk={() => setOpenModal(false)}
          footer={null}
          onCancel={() => setOpenModal(false)}
          destroyOnClose
          centered
        >
          <PurchaseProductForm
            product={product}
            submiting={requesting}
            onFinish={purchaseProduct}
          />
        </Modal>
      )}
    </>
  );
}

PurchaseProductBtn.defaultProps = {
  onSuccess: () => { }
};

export default PurchaseProductBtn;
