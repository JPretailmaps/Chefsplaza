import { CameraOutlined, FileAddOutlined } from '@ant-design/icons';
import { ImageWithFallback } from '@components/common';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Progress,
  Row,
  Select,
  Upload
} from 'antd';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { IProduct } from 'src/interfaces';
import { validateMessages } from '@lib/message';
import classNames from 'classnames';
import style from './form-upload.module.scss';

interface IProps {
  product?: IProduct;
  submit: Function;
  beforeUpload: Function;
  uploading: boolean;
  uploadPercentage: number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function FormProduct(props: IProps) {
  const {
    product, submit, uploading, uploadPercentage, beforeUpload
  } = props;
  const [previewImageProduct, setPreviewImageProduct] = useState(null);
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);
  const [digitalFileAdded, setDigitalFileAdded] = useState(false);
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (product) {
      setIsDigitalProduct(product?.type === 'digital');
      setPreviewImageProduct(product?.image || '/no-image.jpg');
      setDigitalFileAdded(!!product?.digitalFileUrl);
    }
  }, []);

  const setFormVal = (field: string, val: any) => {
    formRef.setFieldsValue({
      [field]: val
    });
    if (field === 'type') {
      setIsDigitalProduct(val === 'digital');
    }
  };

  const beforeUploadThumb = (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const reader = new FileReader();
    reader.addEventListener('load', () => setPreviewImageProduct(reader.result));
    reader.readAsDataURL(file);
    const isValid = file.size / 1024 / 1024 < (config.MAX_SIZE_FILE || 100);
    if (!isValid) {
      message.error(`File is too large please provide an file ${config.MAX_SIZE_FILE || 100}MB or below`);
      return false;
    }
    beforeUpload && beforeUpload(file, 'image');
    return isValid;
  };

  const beforeUploadDigitalFile = (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const isValid = file.size / 1024 / 1024 < (config.MAX_SIZE_FILE || 100);
    if (!isValid) {
      message.error(`File is too large please provide an file ${config.MAX_SIZE_FILE || 100}MB or below`);
      return false;
    }
    setDigitalFileAdded(true);
    beforeUpload && beforeUpload(file, 'digitalFile');
    return isValid;
  };

  const haveProduct = !!product;
  return (
    <div className={classNames(style['product-form'])}>
      <Form
        {...layout}
        onFinish={(data) => {
          if (data.stock) {
            data.stock = Math.round(data.stock);
          }
          submit(data);
        }}
        onFinishFailed={() => message.error('Please complete the required fields')}
        name="form-upload"
        form={formRef}
        validateMessages={validateMessages}
        initialValues={
        product || ({
          name: '',
          price: 1,
          description: '',
          status: 'active',
          performerId: '',
          stock: 1,
          type: 'physical'
        })
      }
        className="account-form"
        scrollToFirstError
      >
        <Row>
          <Col md={12} xs={24}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input name of product!' }]}
              label="Name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select a type!' }]}
            >
              <Select onChange={(val) => setFormVal('type', val)}>
                <Select.Option key="physical" value="physical">
                  Physical
                </Select.Option>
                <Select.Option key="digital" value="digital">
                  Digital
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Price is required!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          {!isDigitalProduct && (
          <Col md={12} xs={12}>
            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: 'Stock is required!' }]}
            >
              <InputNumber
                formatter={(value) => `${Math.round(value)}`}
                precision={1}
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
          </Col>
          )}
          <Col span={24}>
            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please add a description!' }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col md={24} xs={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Select.Option key="active" value="active">
                  Active
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  Inactive
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item label="Image">
              <div className="upload">
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  multiple={false}
                  showUploadList={false}
                  disabled={uploading}
                  beforeUpload={(file) => beforeUploadThumb(file)}
                  customRequest={() => false}
                >
                  <div className="img-upload">
                    {previewImageProduct ? (
                      <ImageWithFallback
                        options={{
                          style: { width: '100%' }
                        }}
                        src={previewImageProduct}
                        alt="file"
                      />
                    )
                      : <CameraOutlined />}
                  </div>
                </Upload>
              </div>
            </Form.Item>
          </Col>
          {isDigitalProduct && (
          <Col md={12} xs={12}>
            <Form.Item label="Digital file">
              <Upload
                className="img-upload"
                listType="picture-card"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => beforeUploadDigitalFile(file)}
                customRequest={() => false}
              >
                {digitalFileAdded ? (
                  <img
                    src="/file-checked.jpg"
                    alt="check"
                    style={{ maxWidth: '100%' }}
                  />
                )
                  : <FileAddOutlined />}
              </Upload>
              {product?.digitalFileUrl && (
              <div
                className="ant-form-item-explain"
                style={{ textAlign: 'left' }}
              >
                <a download target="_blank" href={product?.digitalFileUrl} rel="noreferrer">Click to download</a>
              </div>
              )}
            </Form.Item>
          </Col>
          )}
        </Row>
        {uploadPercentage > 0 ? (
          <Progress percent={Math.round(uploadPercentage)} />
        ) : null}
        <Form.Item wrapperCol={{ ...layout.wrapperCol }} className={style['button-form']} style={{ padding: '0 5px' }}>
          <Button
            className="primary"
            type="primary"
            htmlType="submit"
            loading={uploading}
            disabled={uploading}
          >
            {haveProduct ? 'Update' : 'Upload'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

FormProduct.defaultProps = {
  product: null
};

export default FormProduct;
