import { PlusOutlined } from '@ant-design/icons';
import { IAddress, IProduct } from '@interfaces/index';
import {
  Button, Form, Input, InputNumber, message, Select
} from 'antd';
import { useEffect, useState } from 'react';
import { shippingAddressService } from 'src/services';
import { COUNTRIES } from 'src/constants/countries';
import { ImageWithFallback } from '@components/common';
import { showError } from '@lib/utils';
import { ShippingAddressForm } from './shipping-address-form';
import style from './confirm-purchase.module.scss';

interface IProps {
  submiting: boolean;
  product: IProduct;
  onFinish: Function;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function PurchaseProductForm({
  submiting, product, onFinish
}: IProps) {
  const image = product?.image || '/no-image.jpg';
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState<any>([]);
  const [isNewAddress, setNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formRef] = Form.useForm();

  const handleChangeQuantity = (q: number) => {
    q = Math.round(q);
    if (q < 1) {
      setQuantity(1);
      return;
    }
    if (product.stock < q) {
      message.error('Quantity is out of product stock!');
      return;
    }
    setQuantity(q);
  };

  const getAddresses = async () => {
    const resp = await shippingAddressService.search({ limit: 10 });
    setAddresses(resp?.data?.data || []);
  };

  const addNewAddress = async (payload: any) => {
    try {
      setLoading(true);
      const country = COUNTRIES.find((c) => c.code === payload.country);
      const data = { ...payload, country: country.name };
      const resp = await shippingAddressService.create(data);
      addresses.unshift(resp.data);
      setLoading(false);
      setNewAddress(false);
    } catch (e) {
      showError(e);
      setLoading(false);
      setNewAddress(false);
    }
  };

  const onRemoveAddress = (addressId: string) => {
    formRef.setFieldsValue({ deliveryAddressId: '' });
    setAddresses((items) => items.filter((i) => i._id !== addressId));
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <>
      {!isNewAddress && (
        <div className="text-center">
          <h3>
            Confirm purchase:
            {' '}
            {product?.name}
          </h3>
          <ImageWithFallback
            options={{
              style: { width: '100px', borderRadius: '5px' },
              sizes: '25vw'
            }}
            alt="p-avt"
            src={image}
          />
        </div>
      )}
      {!isNewAddress && (
        <Form
          form={formRef}
          {...layout}
          onFinish={(val) => {
            val.quality = Math.round(val?.quantity || 1);
            onFinish(val);
          }}
          onFinishFailed={() => message.error('Please complete the required fields')}
          name="form-order"
          initialValues={{
            quantity: 1,
            userNote: '',
            phoneNumber: ''
          }}
          className="account-form"
        >
          {product.type === 'physical' && (
            <>
              <Form.Item
                name="quantity"
                rules={[{ required: true, message: 'Please input quantity of product!' }]}
                label="Quantity"
              >
                <InputNumber
                  formatter={(value) => `${Math.round(value)}`}
                  precision={1}
                  onChange={handleChangeQuantity}
                  min={1}
                  max={product.stock}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item
                name="deliveryAddressId"
                rules={[{ required: true, message: 'Please select a delivery address!' }]}
                label={(
                  <div>
                    Delivery address
                    {' '}
                    {addresses.length < 10 && <a onClick={() => setNewAddress(true)} aria-hidden><PlusOutlined style={{ fontSize: 22 }} /></a>}
                  </div>
                )}
              >
                <Select defaultActiveFirstOption onChange={(val: string) => formRef.setFieldsValue({ deliveryAddressId: val })}>
                  {addresses.map((a: IAddress) => (
                    <Select.Option value={a._id} key={a._id}>
                      <div className={style['address-option']}>
                        {a.name}
                        {' '}
                        -
                        {' '}
                        <small>{`${a.streetNumber} ${a.streetAddress} ${a.ward} ${a.district} ${a.city} ${a.state} ${a.zipCode} ${a.country}`}</small>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone number"
                rules={[
                  { required: true, message: 'Please enter your phone number!' },
                  {
                    // eslint-disable-next-line prefer-regex-literals
                    pattern: new RegExp(/^([+]\d{2,4})?\d{9,12}$/g), message: 'Please provide valid digit numbers'
                  }
                ]}
              >
                <Input placeholder="Phone number" />
              </Form.Item>
              <Form.Item
                name="userNote"
                label="Comments"
              >
                <Input.TextArea rows={2} />
              </Form.Item>
            </>
          )}
          <div className="text-center">
            <Button
              htmlType="submit"
              className="primary"
              type="primary"
              block
              loading={submiting}
              disabled={submiting || (product.type === 'physical' && product.stock < quantity)}
            >
              CONFIRM PURCHASE FOR&nbsp;
              $
              {(quantity * product.price).toFixed(2)}
            </Button>
          </div>
        </Form>
      )}
      {isNewAddress && (
        <div className="text-center">
          <h3 className="secondary-color">
            Save your address for the future use
          </h3>
        </div>
      )}
      {isNewAddress && (
        <ShippingAddressForm
          onRemoveAddress={onRemoveAddress}
          addresses={addresses}
          onCancel={() => setNewAddress(false)}
          submiting={loading}
          onFinish={addNewAddress}
        />
      )}
    </>
  );
}
