import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Statistic,
  Tag,
  message
} from 'antd';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { ISettings, IUser, PayoutRequestInterface } from 'src/interfaces';
import classNames from 'classnames';
import style from './payout-request.module.scss';

interface Props {
  submit: Function;
  submiting: boolean;
  payout: Partial<PayoutRequestInterface>;
  statsPayout: {
    totalEarnedTokens: number;
    previousPaidOutTokens: number;
    remainingUnpaidTokens: number;
  };
}

function PayoutRequestForm({
  payout, submit, submiting, statsPayout
}: Props) {
  const { minimumPayoutAmount } = useSelector((state: any) => state.settings) as ISettings;
  const { balance } = useSelector((state: any) => state.user.current) as IUser;
  const {
    requestNote, requestTokens, status, paymentAccountType
  } = payout;

  return (
    <div className={classNames(
      style['payout-request-form']
    )}
    >
      <Form
        layout="vertical"
        className="payout-request-form"
        name="payoutRequestForm"
        onFinish={(data) => {
          if (data.requestTokens < minimumPayoutAmount) {
            message.error(`Minimum payout amount is $${minimumPayoutAmount}`);
            return;
          }
          if (data.requestTokens > balance) {
            message.error('Requested amount must be less than or equal your wallet balance');
            return;
          }
          submit(data);
        }}
        initialValues={{
          requestNote: requestNote || '',
          requestTokens: requestTokens || statsPayout?.remainingUnpaidTokens || minimumPayoutAmount,
          paymentAccountType: paymentAccountType || 'banking'
        }}
        scrollToFirstError
      >
        <div style={{ margin: '0 0 10px 0 ', textAlign: 'center' }}>
          <Space size="large">
            <Statistic
              title="Total Earned"
              value={statsPayout?.totalEarnedTokens || 0}
              precision={2}
              prefix="$"
            />
            <Statistic
              title="Withdrew"
              value={statsPayout?.previousPaidOutTokens || 0}
              precision={2}
              prefix="$"
            />
            <Statistic
              title="Wallet Balance"
              value={statsPayout?.remainingUnpaidTokens || 0}
              precision={2}
              prefix="$"
            />
          </Space>
        </div>
        <Form.Item
          label="Requested amount"
          name="requestTokens"
          extra={`Minimum payout amount is $${minimumPayoutAmount}`}
          validateTrigger={['onChange', 'onBlur']}
          rules={[{
            required: true,
            message: 'Please add the payout amount!'
          },
          {
            type: 'number',
            min: minimumPayoutAmount,
            message: `Minimum payout amount is $${minimumPayoutAmount}`
          },
          {
            type: 'number',
            max: statsPayout?.remainingUnpaidTokens,
            message: `Maximum payout amount is $${statsPayout?.remainingUnpaidTokens}`
          }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            disabled={payout && payout.status === 'done'}
            min={minimumPayoutAmount}
            max={statsPayout?.remainingUnpaidTokens}
          />
        </Form.Item>
        <Form.Item label="Note to Admin" name="requestNote">
          <Input.TextArea disabled={payout && payout.status === 'done'} placeholder="Text something to admin here" rows={3} />
        </Form.Item>
        {payout?.adminNote && (
          <Form.Item label="Admin noted">
            <Alert type="info" message={payout?.adminNote} />
          </Form.Item>
        )}
        {payout._id && (
          <Form.Item label="Status">
            <Tag color="orange" style={{ textTransform: 'capitalize' }}>{status}</Tag>
          </Form.Item>
        )}
        <Form.Item label="Select payout method" name="paymentAccountType">
          <Select>
            {/* {settings?.paymentGateway === 'stripe' && (
              <Select.Option value="stripe" key="stripe">
                <img src="/stripe-icon.jpeg" width="30px" alt="stripe" />
                {' '}
                Stripe
              </Select.Option>
            )} */}
            <Select.Option value="banking" key="banking">
              <img src="/banking-ico.png" width="30px" alt="banking" />
              {' '}
              Banking
            </Select.Option>
            <Select.Option value="paypal" key="paypal">
              <img src="/paypal-ico.png" width="30px" alt="paypal" />
              {' '}
              Paypal
            </Select.Option>
          </Select>
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          <Button
            className="primary"
            loading={submiting}
            htmlType="submit"
            disabled={['done', 'approved'].includes(status) || submiting}
          >
            Submit
          </Button>
          <Button
            className="secondary"
            loading={submiting}
            htmlType="button"
            disabled={submiting}
            onClick={() => Router.back()}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

PayoutRequestForm.defaultProps = {};

export default PayoutRequestForm;
