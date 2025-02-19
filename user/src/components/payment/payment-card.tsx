import { DeleteOutlined } from '@ant-design/icons';
import { IPaymentCard } from '@interfaces/payment';
import { renderCardIcon } from '@lib/image';
import { paymentService } from '@services/payment.service';
import { Button, message } from 'antd';
import { useState } from 'react';
import style from './payment-card.module.scss';

interface P {
  card: IPaymentCard;
  onRemove: Function;
}

export function PaymentCard({ onRemove, card }: P) {
  const [submiting, setsubmiting] = useState(false);

  const handleRemoveCard = async (cardId: string) => {
    if (!window.confirm('Are you sure to remove this payment card?')) return;
    try {
      setsubmiting(true);
      await paymentService.removeCard(cardId);
      onRemove(cardId);
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured please try again later');
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <div className={style['card-item']} key={card._id}>
      <Button className={style['remove-btn']} type="link" disabled={submiting} onClick={() => handleRemoveCard(card._id)}>
        <DeleteOutlined />
      </Button>
      <div className={style['card-holder-name']}>
        {card.holderName || 'Unknown'}
        <span className={style['card-brand']}>{renderCardIcon(card.brand || '')}</span>
      </div>
      <div className={style['card-info']}>
        <span className={style['card-last-number']}>
          {`**** **** **** ${card.last4Digits || ''}`}
        </span>
        <small>{`${card.month}/${card.year}`}</small>
      </div>
    </div>
  );
}
