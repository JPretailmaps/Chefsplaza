import { IPerformer, ISettings } from '@interfaces/index';
import {
  Avatar,
  Button, InputNumber
} from 'antd';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TickIcon } from 'src/icons';

interface IProps {
  performer: IPerformer;
  onFinish: Function;
  submiting: boolean;
}

export function TipPerformerForm({
  onFinish, submiting = false, performer
}: IProps) {
  const [price, setPrice] = useState(10);
  const { minimumTipPrice, maximumTipPrice } = useSelector((state: any) => state.settings) as ISettings;

  const onChangeValue = (val) => {
    setPrice(val);
  };

  return (
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
          THANK YOU FOR THE TIP
        </h2>
        <h3>
          <span className="price">{(price || 0).toFixed(2)}</span>
          {' '}
          USD
        </h3>
        <div className="tip-grps">
          <Button type={price === 10 ? 'primary' : 'default'} onClick={() => onChangeValue(10)}>
            $10
          </Button>
          <Button type={price === 20 ? 'primary' : 'default'} onClick={() => onChangeValue(20)}>
            $20
          </Button>
          <Button type={price === 50 ? 'primary' : 'default'} onClick={() => onChangeValue(50)}>
            $50
          </Button>
          <Button type={price === 100 ? 'primary' : 'default'} onClick={() => onChangeValue(100)}>
            $100
          </Button>
          <Button type={price === 200 ? 'primary' : 'default'} onClick={() => onChangeValue(200)}>
            $200
          </Button>
          <Button type={price === 300 ? 'primary' : 'default'} onClick={() => onChangeValue(300)}>
            $300
          </Button>
          <Button type={price === 400 ? 'primary' : 'default'} onClick={() => onChangeValue(400)}>
            $400
          </Button>
          <Button type={price === 500 ? 'primary' : 'default'} onClick={() => onChangeValue(500)}>
            $500
          </Button>
          <Button type={price === 1000 ? 'primary' : 'default'} onClick={() => onChangeValue(1000)}>
            $1000
          </Button>
        </div>
        <div className="tip-input">
          <p>Enter tip amount</p>
          <InputNumber min={minimumTipPrice} max={maximumTipPrice} onChange={(val) => onChangeValue(val)} value={price} />
        </div>
        <Button
          className="primary"
          disabled={submiting || !price}
          loading={submiting}
          onClick={() => onFinish(price)}
        >
          SEND TIP
        </Button>
      </div>
    </div>
  );
}
