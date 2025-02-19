import { validateMessages } from '@lib/message';
import {
  Button, Col, Form, Input, Row, Select
} from 'antd';
import {
  createRef, useEffect, useRef, useState
} from 'react';
import { COUNTRIES } from 'src/constants/countries';
import { IPerformer } from 'src/interfaces';
import { utilsService } from 'src/services';

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating: boolean;
}

export function PerformerBankingForm({
  onFinish,
  user,
  updating
}: IProps) {
  const [formRef] = Form.useForm();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleGetStates = async (countryCode: string) => {
    const resp = await utilsService.statesList(countryCode);
    setStates(resp.data);
    const eState = resp.data.find((s) => s === user?.bankingInformation?.state);
    if (eState) {
      formRef.setFieldsValue({ state: eState });
    } else {
      formRef.setFieldsValue({ state: '', city: '' });
    }
  };

  const handleGetCities = async (state: string, countryCode: string) => {
    const resp = await utilsService.citiesList(countryCode, state);
    setCities(resp.data);
    const eCity = resp.data.find((s) => s === user?.bankingInformation?.city);
    if (eCity) {
      formRef.setFieldsValue({ city: eCity });
    } else {
      formRef.setFieldsValue({ city: '' });
    }
  };

  useEffect(() => {
    if (user?.bankingInformation?.country) {
      handleGetStates(user?.bankingInformation?.country);
      if (!user?.bankingInformation?.state) {
        handleGetCities(user?.bankingInformation?.state, user?.bankingInformation?.country);
      }
    }
  }, []);

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish.bind(this)}
      validateMessages={validateMessages}
      initialValues={user?.bankingInformation}
      labelAlign="left"
      className="account-form"
      form={formRef}
    >
      <Row>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              { required: true, message: 'Please input your first name!' }
            ]}
          >
            <Input placeholder="First name" />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="lastName"
            label="Last name"
            rules={[
              { required: true, message: 'Please input your last name!' }
            ]}
          >
            <Input placeholder="Last name" />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="bankName"
            label="Bank name"
            rules={[
              { required: true, message: 'Please input your bank name!' }
            ]}
          >
            <Input placeholder="Bank name" />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="bankAccount"
            label="Bank Account"
            rules={[
              { required: true, message: 'Please input your bank account!' }
            ]}
          >
            <Input placeholder="Bank account" />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please choose country!' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              onChange={(val: string) => handleGetStates(val)}
            >
              {COUNTRIES.map((c) => (
                <Option key={c.code} value={c.code} label={c.name}>
                  <img alt="flag" src={c?.flag} width="20px" />
                  {' '}
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="state" label="State">
            <Select
              placeholder="Select your state"
              optionFilterProp="label"
              showSearch
              onChange={(val: string) => handleGetCities(val, formRef.getFieldValue('country'))}
            >
              {states.map((state) => (
                <Option value={state} label={state} key={state}>
                  {state}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item
            name="city"
            label="City"
          >
            <Select
              placeholder="Select your city"
              showSearch
              optionFilterProp="label"
            >
              {cities.map((city) => (
                <Option value={city} label={city} key={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="address" label="Address">
            <Input placeholder="Address" />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="bankRouting" label="Bank Routing">
            <Input placeholder="Bank routing" />
          </Form.Item>
        </Col>
        <Col xl={12} md={12} xs={12}>
          <Form.Item name="bankSwiftCode" label="Bank swift code">
            <Input placeholder="Bank swift code" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item className="text-center">
        <Button
          className="primary"
          htmlType="submit"
          loading={updating}
          disabled={updating}
        >
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
}

export default PerformerBankingForm;
