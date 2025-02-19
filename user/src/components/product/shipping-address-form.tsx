import { IAddress } from '@interfaces/index';
import {
  Button, Col, List,
  Form, Input, message, Row, Select, Divider
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { COUNTRIES } from 'src/constants/countries';
import { showError } from '@lib/utils';
import { shippingAddressService } from '@services/shipping-address.service';

const citystatejson = require('countrycitystatejson');

interface IProps {
  submiting: boolean;
  onFinish: Function;
  onCancel: Function;
  addresses: IAddress[];
  onRemoveAddress: Function;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function ShippingAddressForm({
  submiting, onFinish, onCancel, addresses, onRemoveAddress
}: IProps) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const formRef = useRef() as any;

  const handleGetStates = async (countryCode: string) => {
    if (!countryCode) return;
    const data = await citystatejson.getStatesByShort(countryCode);
    setStates(data);
  };

  const handleGetCities = async (state: string, countryCode: string) => {
    if (!state || !countryCode) return;
    const data = await citystatejson.getCities(countryCode, state);
    setCities(data);
  };

  const deleteAddress = async (id) => {
    try {
      await shippingAddressService.delete(id);
      onRemoveAddress(id);
    } catch (e) {
      showError(e);
    }
  };

  return (
    <Form
      ref={formRef}
      {...layout}
      onFinish={(data) => onFinish(data)}
      onFinishFailed={() => message.error('Please complete the required fields')}
      name="form-address"
      className="account-form"
    >
      <Row>
        <Col md={24} xs={24}>
          <Form.Item
            name="name"
            label="Address Name"
            rules={[
              {
                required: true, message: 'Please enter address name!'
              }
            ]}
          >
            <Input placeholder="School, home, Work,..." />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="country"
            label="Country"
            rules={[
              {
                required: true, message: 'Please select your country!'
              }
            ]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              onChange={(code: string) => handleGetStates(code)}
            >
              {COUNTRIES.map((c) => (
                <Select.Option value={c.code} label={c.name} key={c.code}>
                  <img alt="country_flag" src={c.flag} width="25px" />
                  {' '}
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="state"
            label="State"
            rules={[
              {
                required: true, message: 'Please select your state!'
              }
            ]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              onChange={(s: string) => handleGetCities(s, formRef.current.getFieldValue('country'))}
              placeholder="State/county/province"
            >
              <Select.Option value="n/a" key="N/A">
                N/A
              </Select.Option>
              {states.map((s) => (
                <Select.Option value={s} label={s} key={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="city"
            label="City"
            rules={[
              {
                required: true, message: 'Please select your city!'
              }
            ]}
          >
            <Select
              showSearch
              optionFilterProp="label"
            >
              <Select.Option value="n/a" key="N/A">
                N/A
              </Select.Option>
              {cities.map((c) => (
                <Select.Option value={c} label={c} key={c}>
                  {c}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="district"
            label="District"
            rules={[
              {
                required: true, message: 'Please enter your district!'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="ward"
            label="Ward"
            rules={[
              {
                required: true, message: 'Please enter your ward!'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="streetAddress"
            label="Street Address"
            rules={[
              {
                required: true, message: 'Please select your street address!'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="streetNumber"
            label="Street Number"
            rules={[
              {
                required: true, message: 'Please select your street number!'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="zipCode"
            label="Zip Code"
            rules={[
              { required: true, message: 'Please provide your zip code' },
              {
                pattern: /^\d{2,10}$/g, message: 'Please provide valid digit numbers'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={24} xs={24}>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-center">
        <Button
          htmlType="submit"
          className="primary"
          type="primary"
          loading={submiting}
          disabled={submiting}
        >
          Save
        </Button>
        &nbsp;
        <Button
          className="secondary"
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
      </div>
      <Divider>
        {addresses.length > 0 && addresses.length}
        {' '}
        Addresses
      </Divider>
      <List
        header={null}
        footer={null}
        bordered={false}
        dataSource={addresses}
        renderItem={(a) => (
          <List.Item key={a._id}>
            <Button type="primary" onClick={() => deleteAddress(a._id)}><DeleteOutlined /></Button>
            &nbsp;
            {a.name}
            {' '}
            -
            {' '}
            <small>{`${a.streetNumber} ${a.streetAddress} ${a.ward} ${a.district} ${a.city} ${a.state} ${a.zipCode} ${a.country}`}</small>
          </List.Item>
        )}
      />
    </Form>
  );
}
