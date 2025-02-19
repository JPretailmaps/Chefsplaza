import { showError } from '@lib/utils';
import { tokenTransctionService } from '@services/token-transaction.service';
import {
  Button, Form, Modal, message
} from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { IPerformer, IStream } from 'src/interfaces';

interface IProps {
  stream: IStream;
  performer: IPerformer;
  onFinish: Function;
  onCancel: Function;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function PurchaseStreamModal({
  stream,
  performer,
  onFinish,
  onCancel
}: IProps) {
  const [openPurchaseModal, setOpenPurchaseModal] = useState(!stream.isFree && !stream.hasPurchased);
  const [submiting, setsubmiting] = useState(false);
  const user = useSelector((state: any) => state.user.current);
  const router = useRouter();

  const purchaseStream = async () => {
    try {
      // const { user, updateBalance: handleUpdateBalance } = this.props;
      if (stream.isFree || !stream.sessionId) return;
      // TODO - get error from server side, don't need to check here
      if (user.balance < stream.price) {
        message.error(
          'You have an insufficient wallet balance. Please top up.',
          10
        );
        router.push('/wallet');
        return;
      }
      setsubmiting(true);
      const resp = await tokenTransctionService.purchaseStream(stream._id);
      onFinish(resp.data);
      // handleUpdateBalance({ token: -activeStream.price });
      setOpenPurchaseModal(false);
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {openPurchaseModal && (
        <Modal
          centered
          key="confirm_join_stream"
          title={`Join ${performer.username} live chat`}
          open={openPurchaseModal}
          footer={null}
          destroyOnClose
          closable={false}
          maskClosable={false}
          onCancel={() => onCancel()}
        >
          <div className="text-center">
            <div className="tip-performer">
              <img alt="p-avt" src={(performer?.avatar) || '/no-avatar.jpg'} style={{ width: '100px', borderRadius: '50%' }} />
              <div>
                {performer?.name || 'N/A'}
                <br />
                <small>
                  @
                  {performer?.username || 'n/a'}
                </small>
              </div>
            </div>
            <Form
              {...layout}
              name="nest-messages"
              onFinish={purchaseStream}
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button className="primary" htmlType="submit" loading={submiting} disabled={submiting} block>
                  Confirm to join this session for $
                  {(stream.price || 0).toFixed(2)}
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      )}
    </>
  );
}

export default PurchaseStreamModal;
