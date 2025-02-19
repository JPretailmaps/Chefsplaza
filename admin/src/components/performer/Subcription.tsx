import { useEffect, useState } from 'react';
import {
  Form, Button, message, InputNumber, Switch, Row, Col
} from 'antd';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

interface IProps {
  onFinish: Function;
  performer: IPerformer;
  submitting: boolean;
}

export function SubscriptionForm({ performer, onFinish, submitting }: IProps) {
  const [isFreeSubscription, setIsFreeSubscription] = useState(!!performer?.isFreeSubscription);
  const [freeSubscriptionDuration, setDuration] = useState(performer.durationFreeSubscriptionDays);

  return (
    <Form
      {...layout}
      name="form-performer"
      onFinish={(data) => onFinish(data)}
      onFinishFailed={() => message.error('Please complete the required fields in tab general info')}
      validateMessages={validateMessages}
      initialValues={
        performer || ({
          isFreeSubscription: false,
          yearlyPrice: 99.99,
          monthlyPrice: 9.99,
          publicChatPrice: 1
        })
      }
    >
      <Row>
        <Col xs={24} md={12}>
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
          <Form.Item
            key="yearly"
            name="yearlyPrice"
            label="Yearly Subscription Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            key="monthly"
            name="monthlyPrice"
            label="Monthly Subscription Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            key="publicChatPrice"
            name="publicChatPrice"
            label="Default Streaming Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
        <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
