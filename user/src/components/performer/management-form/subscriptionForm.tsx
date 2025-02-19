import { validateMessages } from '@lib/message';
import { updatePerformer } from '@redux/user/actions';
import {
  Button, Col, Divider, Form, InputNumber, Row, Switch
} from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPerformer, ISettings } from 'src/interfaces';
import style from './subscriptionForm.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
}

export function PerformerSubscriptionForm({
  user
}: IProps) {
  const dispatch = useDispatch();
  const { updating } = useSelector((state: any) => state.user);
  const [isFreeSubscription, setIsFreeSubscription] = useState(!!user?.isFreeSubscription);
  const [freeSubscriptionDuration, setDuration] = useState(user.durationFreeSubscriptionDays);
  const {
    minimumSubscriptionPrice,
    maximumSubscriptionPrice
  } = useSelector((state: any) => state.settings) as ISettings;

  const submit = (data: any) => {
    dispatch(updatePerformer({
      ...user,
      ...data
    }));
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(values) => submit(values)}
      validateMessages={validateMessages}
      initialValues={user}
      labelAlign="left"
      className={style['subscription-form']}
      scrollToFirstError
    >
      <Row>
        <Col xl={12} md={12} xs={24}>

          <Form.Item name="isFreeSubscription" valuePropName="checked">
            <Switch unCheckedChildren="Paid Subscription" checkedChildren="Unpaid Subscription" onChange={(val) => setIsFreeSubscription(val)} />
          </Form.Item>
          {isFreeSubscription && (
            <Form.Item
              name="durationFreeSubscriptionDays"
              label="Duration (days)"
              extra={(
                <p className="black-color">
                  User can try
                  <b>
                    {' '}
                    {freeSubscriptionDuration}
                    {' '}
                    days
                    {' '}
                  </b>
                  of free subscription before subscribe to a subscription.
                </p>
              )}
              rules={[{ required: true }]}
            >
              <InputNumber onChange={(v) => setDuration(v)} min={1} max={30} />
            </Form.Item>
          )}
          <Divider>*</Divider>
          <Form.Item
            name="monthlyPrice"
            label="Monthly Subscription Price"
            rules={[{ required: true, message: 'Please add monthly subscription price' },
              { min: minimumSubscriptionPrice, type: 'number', message: `Mininum price is $${minimumSubscriptionPrice}` },
              { max: maximumSubscriptionPrice, type: 'number', message: `Maximum price is $${maximumSubscriptionPrice}` }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item
            className="text-left"
            name="yearlyPrice"
            label="Yearly Subscription Price"
            rules={[{ required: true, message: 'Please add yearly subscription price' },
              { min: minimumSubscriptionPrice, type: 'number', message: `Mininum price is $${minimumSubscriptionPrice}` },
              { max: maximumSubscriptionPrice, type: 'number', message: `Maximum price is $${maximumSubscriptionPrice}` }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item
            className="text-left"
            key="publicChatPrice"
            name="publicChatPrice"
            label="Default Streaming Price"
            rules={[{ required: true, message: 'Please add default streaming price' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={10000} />
          </Form.Item>
          <Button
            block
            className="primary"
            htmlType="submit"
            disabled={updating}
            loading={updating}
          >
            Save Changes
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default PerformerSubscriptionForm;
