import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import Loader from '@components/common/base/loader';
import SeoMetaHead from '@components/common/seo-meta-head';
import { CardSelector } from '@components/payment';
import { ISettings, IUser } from '@interfaces/index';
import { paymentService } from '@services/index';
import {
  useStripe
} from '@stripe/react-stripe-js';
import {
  Alert, Button, Form, Input, InputNumber, message
} from 'antd';
import Router from 'next/router';
import { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { WalletIcon } from 'src/icons';
import { showError } from '@lib/utils';
import PageHeading from '@components/common/page-heading';
import style from './wallet.module.scss';

interface IProps {
  user: IUser;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

function TokenPackages({ user }: IProps) {
  const {
    paymentGateway, stripePublishableKey, minimumWalletPrice, maximumWalletPrice
  } = useSelector((state: any) => state.settings) as ISettings;
  const [submiting, setsubmiting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [amount, setAmount] = useState(minimumWalletPrice);
  const stripe = paymentGateway === 'stripe' && stripePublishableKey && useStripe();
  const [form] = Form.useForm();

  const addFund = async ({ cardId, amount: value }) => {
    if ((value < minimumWalletPrice) || (value > maximumWalletPrice)) {
      message.error(`Minimum amount must be $${minimumWalletPrice} and maximum amount must be $${maximumWalletPrice}`);
      return;
    }
    if (['stripe'].includes(paymentGateway) && !cardId) {
      message.error('Please add a payment card');
      Router.push('/user/cards');
      return;
    }
    try {
      setsubmiting(true);
      const resp = await paymentService.addFunds({
        paymentGateway,
        amount: value,
        cardId: cardId || '',
        couponCode: coupon ? couponCode : ''
      });
      // to confirm 3D secure
      if (paymentGateway === 'stripe') {
        stripe && resp?.data?.stripeClientSecret && stripe.confirmCardPayment(resp?.data?.stripeClientSecret);
      }
      if (paymentGateway === 'ccbill') {
        window.location.href = resp?.data?.paymentUrl;
      }
    } catch (e) {
      showError(e);
      setsubmiting(false);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const resp = await paymentService.applyCoupon(code);
      setCoupon(resp.data);
      message.success('Coupon is applied');
    } catch (e) {
      showError(e);
    }
  };

  const setCardId = (cardId: string) => {
    form.setFieldsValue({ cardId });
  };

  return (
    <>
      <SeoMetaHead pageTitle="Wallet" />
      <div className="main-container">
        <PageHeading title="Wallet" icon={<ArrowLeftOutlined />} />
        <div className={style['purchase-form']}>
          <div className={style['current-balance']}>
            <WalletIcon />
            <div className={style.balance}>
              <b>Current Balance</b>
              <span className={style.amount}>
                $
                {(user.balance || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <Alert type="warning" style={{ maxWidth: '100%', width: 550, margin: '10px auto' }} message="Wallet Balances can be used as a convenient method to send tips to your favorite performers as well as digital content. Once your wallet balance depletes you can simply top off your wallet account to continue enjoying the benefits." />
          <Form
            form={form}
            onFinish={addFund}
            onFinishFailed={() => message.error('Please complete the required fields')}
            name="form-upload"
            scrollToFirstError
            initialValues={{
              amount: minimumWalletPrice
            }}
            {...layout}
          >
            <Form.Item
              name="amount"
              label="Enter Amount"
              rules={[{ required: true, message: 'Please add your top up amount!' }]}
              validateTrigger={['onChange', 'onBlur']}
              extra={(
                <>
                  <p className="black-color" style={{ fontSize: 11 }}>
                    Minimum top up wallet amount $
                    {minimumWalletPrice}
                  </p>
                  <p className="black-color" style={{ fontSize: 11 }}>
                    Maximum top up wallet amount $
                    {maximumWalletPrice}
                  </p>
                </>
              )}
            >
              <InputNumber
                type="number"
                onChange={(val) => setAmount(val)}
                step={1}
                style={{ width: '100%' }}
                min={0}
                max={maximumWalletPrice}
              />
            </Form.Item>
            {paymentGateway === 'stripe' && stripePublishableKey && (
            <Form.Item
              name="cardId"
              label="Payment card"
              validateTrigger={['onChange', 'onBlur']}
              rules={[{ required: true, message: 'Please choose your payment card' }]}
            >
              <CardSelector onSelect={setCardId} />
            </Form.Item>
            )}
            <Form.Item help={coupon && (
              <small style={{ color: 'red' }}>
                Discount
                {' '}
                {coupon.value * 100}
                %
              </small>
            )}
            >
              <Button.Group className={style['coupon-dc']}>
                <Input disabled={!!coupon} placeholder="Enter coupon code here" onChange={(e) => setCouponCode(e.target.value)} />
                {!coupon ? <Button disabled={!couponCode} onClick={() => applyCoupon(couponCode)}>Apply!</Button>
                  : (
                    <Button
                      type="primary"
                      onClick={() => {
                        setCoupon(null);
                        setCouponCode('');
                      }}
                    >
                      Use Later!
                    </Button>
                  )}
              </Button.Group>
            </Form.Item>
            <Form.Item className={style['total-price']}>
              Total:
              <span className={style.amount}>
                $
                {(amount - (amount * (coupon?.value || 0))).toFixed(2)}
              </span>
            </Form.Item>
            <Form.Item className="text-center">
              <Button htmlType="submit" className="primary" disabled={submiting} loading={submiting}>
                BUY NOW
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Loader active={submiting} customText="The amount will be added to the wallet 15 seconds to 1 min." />
      </div>
    </>
  );
}

TokenPackages.authenticate = true;

const mapStates = (state) => ({
  user: { ...state.user.current }
});

export default connect(mapStates)(TokenPackages);
