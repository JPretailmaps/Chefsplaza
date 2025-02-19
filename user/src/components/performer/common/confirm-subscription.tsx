import {
  CheckSquareOutlined
} from '@ant-design/icons';
import Loader from '@components/common/base/loader';
import { CardSelector } from '@components/payment';
import { setSubscription } from '@redux/subscription/actions';
import { paymentService } from '@services/payment.service';
import { useStripe } from '@stripe/react-stripe-js';
import {
  Avatar, Button, message, Modal
} from 'antd';
import {
  useContext, useEffect, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TickIcon } from 'src/icons';
import {
  IPerformer, ISettings, ITransaction, IUser
} from 'src/interfaces';
import { SocketContext } from 'src/socket';
import { showError } from '@lib/utils';
import Router, { useRouter } from 'next/router';

interface IProps {
  subscriptionType: string;
  performer: IPerformer;
  showModal: boolean;
}

function ConfirmSubscriptionPerformerForm() {
  const { subscriptionType, performer, showModal }: IProps = useSelector((state: any) => state.subscription);
  const user = useSelector((state: any) => state.user.current) as IUser;
  const { paymentGateway, stripePublishableKey } = useSelector((state: any) => state.settings) as ISettings;

  const [submiting, setsubmiting] = useState(false);
  const [cardId, setCardId] = useState('');
  const dispatch = useDispatch();
  const stripe = paymentGateway === 'stripe' && stripePublishableKey && useStripe();
  const { socket } = useContext(SocketContext);
  const router = useRouter();

  const subscribe = async () => {
    try {
      if (!user._id) {
        message.error('Please log in or register!');
        dispatch(setSubscription({ showModal: false, performerId: '' }));
        Router.push({
          pathname: '/auth/login',
          href: '/'
        });
        return;
      }
      if (paymentGateway === 'stripe' && !cardId) {
        message.error('Please add a payment card');
        dispatch(setSubscription({ showModal: false, performerId: '' }));
        Router.push('/user/cards');
        return;
      }
      setsubmiting(true);
      const resp = await paymentService.subscribePerformer({
        type: subscriptionType || 'monthly',
        performerId: performer._id,
        paymentGateway,
        cardId
      });
      if (paymentGateway === 'ccbill' && subscriptionType !== 'free') {
        window.location.href = resp?.data?.paymentUrl;
      }
    } catch (e) {
      showError(e);
      dispatch(setSubscription({ showModal: false, performerId: '' }));
      setsubmiting(false);
    }
  };

  const onConfirmPayment = (transaction: ITransaction) => {
    if (paymentGateway === 'stripe') {
      stripe && transaction?.stripeClientSecret && stripe.confirmCardPayment(transaction?.stripeClientSecret);
    }
  };

  useEffect(() => {
    socket && socket.on('stripe_confirm_payment', onConfirmPayment);
    return () => {
      socket && socket.off('stripe_confirm_payment', onConfirmPayment);
    };
  }, [stripe, paymentGateway]);

  useEffect(() => {
    router.events.on('routeChangeStart', () => dispatch(setSubscription({ showModal: false })));
    return () => {
      router.events.off('routeChangeStart', () => dispatch(setSubscription({ showModal: false })));
    };
  }, [socket]);

  return (
    <>
      {showModal && (
        <Modal
          key="subscribe_performer"
          className="subscription-modal"
          width={600}
          centered
          maskClosable={false}
          title={null}
          open={showModal}
          footer={null}
          onCancel={() => dispatch(setSubscription({ showModal: false }))}
        >
          <div className="confirm-purchase-form">
            <div className="left-col">
              <Avatar src={performer?.avatar || '/no-avatar.jpg'} />
              <div className="p-name">
                {performer?.name || 'N/A'}
                {' '}
                {performer?.verifiedAccount && <TickIcon className="primary-color" />}
              </div>
              <div className="p-username">
                @
                {performer?.username || 'n/a'}
              </div>
              <img className="lock-icon" src="/lock-icon.png" alt="lock" />
            </div>
            <div className="right-col">
              <h2>
                Subscribe
                {' '}
                <span className="username">{`@${performer?.username}` || 'the creator'}</span>
              </h2>
              {subscriptionType === 'monthly' && (
                <h3>
                  <span className="price">{(performer?.monthlyPrice || 0).toFixed(2)}</span>
                  {' '}
                  USD/month
                </h3>
              )}
              {subscriptionType === 'yearly' && (
                <h3>
                  <span className="price">{(performer?.yearlyPrice || 0).toFixed(2)}</span>
                  {' '}
                  USD/year
                </h3>
              )}
              {subscriptionType === 'free' && (
                <h3>
                  <span className="price">FREE</span>
                  {' '}
                  for
                  {' '}
                  {performer?.durationFreeSubscriptionDays}
                  {' '}
                  day
                  {performer?.durationFreeSubscriptionDays > 1 ? 's' : ''}
                </h3>
              )}
              <ul className="check-list">
                <li>
                  <CheckSquareOutlined />
                  {' '}
                  Full access to this creator&apos;s exclusive content
                </li>
                <li>
                  <CheckSquareOutlined />
                  {' '}
                  Direct message with this creator
                </li>
                <li>
                  <CheckSquareOutlined />
                  {' '}
                  Requested personalised Pay Per View content
                </li>
                <li>
                  <CheckSquareOutlined />
                  {' '}
                  Cancel your subscription at any time
                </li>
              </ul>
              <CardSelector active={showModal} onSelect={(id: string) => setCardId(id)} />
              <Button
                className="primary"
                disabled={submiting}
                loading={submiting}
                onClick={() => subscribe()}
              >
                SUBSCRIBE
              </Button>
              <p className="sub-text">Clicking &quot;Subscribe&quot; will take you to the payment screen to finalize you subscription</p>
            </div>
          </div>
        </Modal>
      )}
      <Loader active={submiting} customText="Your payment is processing, it might take 15 seconds to 1 min." />
    </>
  );
}

export default ConfirmSubscriptionPerformerForm;
