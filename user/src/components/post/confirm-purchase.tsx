import { ImageWithFallback } from '@components/common';
import { IFeed, IUser } from '@interfaces/index';
import { showError } from '@lib/utils';
import { updateBalance } from '@redux/user/actions';
import { tokenTransctionService } from '@services/token-transaction.service';
import {
  Avatar, Button, Modal, message
} from 'antd';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TickIcon } from 'src/icons';

const SubscribeButtons = dynamic(() => (import('@components/performer/buttons/subscribe-buttons')), { ssr: false });

interface IProps {
  feed: IFeed;
  open: boolean;
  onClose: Function;
}

function PurchaseFeedForm(props: IProps) {
  const {
    feed, open, onClose
  } = props;
  if (!open) return null;
  const [submiting, setSubmiting] = useState(false);
  const user = useSelector((state: any) => state.user.current) as IUser;
  const dispatch = useDispatch();

  const onPurchase = async () => {
    try {
      setSubmiting(true);
      // current balance < feed.price -> show alert
      if (user.balance < feed.price) {
        message.error('You have an insufficient wallet balance. Please top up.');
        Router.push('/wallet');
        return;
      }
      await tokenTransctionService.purchaseFeed(feed._id, {});
      dispatch(updateBalance({ token: -feed.price }));
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      key="purchase_feed"
      width={600}
      centered
      maskClosable={false}
      title={null}
      open={open}
      footer={null}
      onCancel={() => onClose()}
    >
      <div className="confirm-purchase-form">
        <div className="left-col">
          <Avatar src={feed?.performer?.avatar || '/no-avatar.jpg'} />
          <div className="p-name">
            {feed?.performer?.name || 'N/A'}
            {' '}
            {feed?.performer?.verifiedAccount && <TickIcon className="primary-color" />}
          </div>
          <div className="p-username">
            @
            {feed?.performer?.username || 'n/a'}
          </div>
          <ImageWithFallback
            options={{
              className: 'lock-icon'
            }}
            src="/lock-icon.png"
            alt="lock"
          />
        </div>
        {feed.isSale ? (
          <div className="right-col">
            <h2>
              Unlock Content
            </h2>
            <h3>
              <span className="price">{(feed?.price || 0).toFixed(2)}</span>
              {' '}
              USD
            </h3>
            <p className="description">
              {feed.text}
            </p>
            <Button
              className="primary"
              disabled={submiting}
              loading={submiting}
              onClick={() => onPurchase()}
            >
              CONFIRM TO UNLOCK
            </Button>
          </div>
        ) : (
          <div className="right-col">
            <h2>
              Subscribe to unlock
            </h2>
            <SubscribeButtons performer={feed.performer} />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default PurchaseFeedForm;
