import {
  Form, Input, Button, Select, message, Row, Col
} from 'antd';
import { COUNTRIES } from 'src/constants';
import { IBankingSetting, ICountry } from 'src/interfaces';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: 'Must be between ${min} and ${max}'
  }
};

interface IProps {
  onFinish: Function;
  bankingInformation: IBankingSetting;
  submitting: boolean;
}

export function BankingForm({
  bankingInformation, onFinish, submitting
}: IProps) {
  return (
    <Form
      {...layout}
      name="form-banking-performer"
      onFinish={(data) => onFinish(data)}
      onFinishFailed={() => message.error('Please complete the required fields')}
      validateMessages={validateMessages}
      initialValues={
        bankingInformation || ({
          firstName: '',
          lastName: '',
          SSN: '',
          bankName: '',
          bankAccount: '',
          bankRouting: '',
          bankSwiftCode: '',
          address: '',
          city: '',
          state: '',
          country: ''
        } as IBankingSetting)
      }
    >
      <Row>
        <Col md={12} xs={24}>
          <Form.Item name="bankName" label="Bank Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="bankAccount" label="Bank Account" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Select
              showSearch
            >
              {COUNTRIES.map((country) => (
                <Select.Option key={country.code} value={country.code}>
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="firstName" label="First Name">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="lastName" label="Last Name">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="SSN" label="SSN">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="bankRouting" label="Routing Number">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="bankSwiftCode" label="Swift Code">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="state" label="State/County/Province">
            <Input />
          </Form.Item>
        </Col>
        <Col md={24} xs={24}>
          <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
            <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
