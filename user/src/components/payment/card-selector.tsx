import { IPaymentCard } from '@interfaces/payment';
import { renderCardIcon } from '@lib/image';
import { paymentService } from '@services/payment.service';
import { Select } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface P {
  onSelect: Function;
  defaultValue?: string;
  active?: boolean;
}

export function CardSelector({ onSelect, defaultValue, active }: P) {
  const [cards, setCards] = useState<IPaymentCard[]>([]);
  const paymentGateway = useSelector((state: any) => state.settings.paymentGateway);

  const getCards = async () => {
    const resp = await paymentService.getCards({
      paymentGateway,
      limit: 10
    });
    setCards(resp?.data?.data || []);
  };

  useEffect(() => {
    getCards();
  }, [active]);

  return (
    <Select
      defaultValue={defaultValue}
      placeholder="Select a payment card"
      onChange={(val) => onSelect(val)}
      style={{ width: '100%', marginBottom: 10 }}
    >
      {!cards.length && <div className="text-center"><Link href="/user/cards">Add a payment card now.</Link></div>}
      {cards.map((c) => (
        <Select.Option key={c._id} value={c.token}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <span>{renderCardIcon(c.brand)}</span>
            <span>{`**** ${c.last4Digits}`}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

CardSelector.defaultProps = {
  defaultValue: '',
  active: false
};
