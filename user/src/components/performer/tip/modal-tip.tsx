import { IPerformer } from '@interfaces/performer';
import { showError } from '@lib/utils';
import { updateBalance } from '@redux/user/actions';
import { tokenTransctionService } from '@services/token-transaction.service';
import { message, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';

import { IUser } from '@interfaces/user';
import { IConversation } from '@interfaces/message';
import style from './modal-tip.module.scss';
import { TipPerformerForm } from './tip-form';

const mapStates = (state: any) => ({
  loggedIn: state.auth.loggedIn
});

const mapActions = {
  hdUpdateBalance: updateBalance
};

const connector = connect(mapStates, mapActions);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  performer: IPerformer;
  open?: boolean;
  sessionId?: string;
  conversationId?: string;
  onClose?: Function;
} & PropsFromRedux;

export function ModalTip({
  performer,
  loggedIn,
  hdUpdateBalance,
  sessionId,
  conversationId,
  open = true,
  onClose = () => { }
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useSelector((state: any) => state.user.current) as IUser;

  const sendTip = async (price: number) => {
    try {
      if (!loggedIn) {
        message.error('Please login to do this action');
        return;
      }
      if (price <= 0) {
        message.error('Choose or Enter the tip Amount from the options');
        return;
      }
      setLoading(true);
      if (user.balance < price) {
        message.error('You have an insufficient wallet balance. Please top up.');
        router.push('/wallet');
        return;
      }
      await tokenTransctionService.sendTip(performer._id, {
        price,
        conversationId,
        sessionId,
        streamType: 'stream_public'
      });
      message.success('Thank you for the tip');
      hdUpdateBalance({
        token: -price
      });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!open) return null;
  return (
    <Modal
      key="tip_performer"
      className={style['subscription-modal']}
      open
      centered
      onOk={() => onClose()}
      footer={null}
      width={600}
      title={null}
      onCancel={() => onClose()}
      destroyOnClose
    >
      <TipPerformerForm
        performer={performer}
        submiting={loading}
        onFinish={sendTip}
      />
    </Modal>
  );
}

ModalTip.defaultProps = {
  open: false,
  sessionId: '',
  conversationId: '',
  onClose: () => { }
};

export default connector(ModalTip);
