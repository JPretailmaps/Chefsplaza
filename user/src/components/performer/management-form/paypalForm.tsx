import { validateMessages } from '@lib/message';
import {
  Button, Col,
  Form, Input, Row
} from 'antd';
import { IPerformer } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating: boolean;
}

export function PerformerPaypalForm({ onFinish, user, updating }: IProps) {
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(val) => onFinish(val)}
      validateMessages={validateMessages}
      initialValues={user?.paypalSetting?.value || {
        email: '',
        phoneNumber: ''
      }}
      labelAlign="left"
      className="account-form"
    >
      <Row>
        <Col lg={12} xs={24}>
          <Form.Item
            name="email"
            label="Paypal account email"
          >
            <Input />
          </Form.Item>
          <Form.Item className="text-center">
            <Button className="secondary" htmlType="submit" disabled={updating} loading={updating}>
              Submit
            </Button>
          </Form.Item>
        </Col>
        {/* <Col lg={12} xs={24}>
            <Form.Item
              name="phoneNumber"
              label="Paypal Phone Number"
              validateTrigger={['onChange', 'onBlur']}
              rules={[{ required: true },
                {
                  pattern: new RegExp(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/u),
                  message: 'Please enter valid phone number format eg +86 800 555 1234'
                }]}
            >
              <Input />
            </Form.Item>
          </Col> */}
      </Row>
    </Form>
  );
}

export default PerformerPaypalForm;
