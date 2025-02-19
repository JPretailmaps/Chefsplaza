import {
  useState, useEffect
} from 'react';
import {
  Form, Input, InputNumber, Select, Upload, Button, message, Progress
} from 'antd';
import { IProduct } from 'src/interfaces';
import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { showError, validateMessages } from '@lib/message';
import Router from 'next/router';
import { productService } from '@services/product.service';

interface IProps {
  product: IProduct;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export function FormProduct({ product }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const [previewImageProduct, setPreviewImageProduct] = useState(null);
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);
  const [formRef] = Form.useForm();
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [digitalFile, setDigitalFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    if (product) {
      setPreviewImageProduct(product?.image || '');
    }
  }, []);

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const setFormVal = (field: string, val: any) => {
    formRef.setFieldsValue({
      [field]: val
    });
    if (field === 'type') {
      setIsDigitalProduct(val === 'digital');
      val === 'physical' && setDigitalFile(null);
    }
  };

  const beforeUpload = (file, field) => {
    if (field === 'image') {
      const reader = new FileReader();
      reader.addEventListener('load', () => setPreviewImageProduct(reader.result));
      reader.readAsDataURL(file);
      setThumbnailFile(file);
    }
    if (field === 'digitalFile') {
      setDigitalFile(file);
    }
    return true;
  };

  const submit = async (data: any) => {
    if (data.type === 'digital' && !digitalFile) {
      message.error('Please select digital file!');
      return;
    }

    const files = [] as any;
    if (digitalFile) {
      files.push({
        fieldname: 'digitalFile',
        file: digitalFile
      });
    }
    if (thumbnailFile) {
      files.push({
        fieldname: 'image',
        file: thumbnailFile
      });
    }

    try {
      !product ? await productService.createProduct(
        files,
        data,
        onUploading
      ) : await productService.update(
        product._id,
        files,
        data,
        onUploading
      );
      message.success('Product has been created');
      Router.push('/product');
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const haveProduct = !!product;

  return (
    <Form
      {...layout}
      onFinish={(data) => submit(data)}
      name="form-upload"
      form={formRef}
      validateMessages={validateMessages}
      initialValues={
        product || ({
          name: '',
          price: 9.99,
          description: '',
          status: 'active',
          performerId: '',
          stock: 99,
          type: 'physical'
        })
      }
    >
      <Form.Item name="performerId" label="Creator" rules={[{ required: true }]}>
        <SelectPerformerDropdown
          placeholder="Select a creator"
          disabled={haveProduct}
          defaultValue={product && product.performerId}
          onSelect={(val) => setFormVal('performerId', val)}
        />
      </Form.Item>
      <Form.Item name="name" rules={[{ required: true, message: 'Please input name of product!' }]} label="Name">
        <Input placeholder="Enter product name" />
      </Form.Item>
      <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select type!' }]}>
        <Select onChange={(val) => setFormVal('type', val)}>
          <Select.Option key="physical" value="physical">
            Physical
          </Select.Option>
          <Select.Option key="digital" value="digital">
            Digital
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="price" label="Price">
        <InputNumber min={1} />
      </Form.Item>
      {!isDigitalProduct && (
        <Form.Item name="stock" label="Stock">
          <InputNumber min={1} />
        </Form.Item>
      )}
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Image">
        <Upload
          accept="image/*"
          listType="picture-card"
          className="avatar-uploader"
          multiple={false}
          showUploadList={false}
          disabled={submiting}
          beforeUpload={(file) => beforeUpload(file, 'image')}
        >
          {previewImageProduct && (
            <img src={previewImageProduct} alt="file" width="100%" />
          )}
          <CameraOutlined />
        </Upload>
      </Form.Item>
      {isDigitalProduct && (
        <Form.Item label="Digital file" help={digitalFile?.name || null}>
          <Upload
            multiple={false}
            listType="picture-card"
            className="avatar-uploader"
            showUploadList
            disabled={submiting || haveProduct}
            beforeUpload={(file) => beforeUpload(file, 'digitalFile')}
          >
            <UploadOutlined />
          </Upload>
          {product?.digitalFileId && <div className="ant-form-item-explain" style={{ textAlign: 'left' }}><a download href={product?.digitalFileUrl}>Click to download</a></div>}
          {uploadPercentage ? <Progress percent={uploadPercentage} /> : null}
        </Form.Item>
      )}
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
        <Select>
          <Select.Option key="active" value="active">
            Active
          </Select.Option>
          <Select.Option key="inactive" value="inactive">
            Inactive
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
        <Button type="primary" htmlType="submit" loading={submiting}>
          {haveProduct ? 'Update' : 'Upload'}
        </Button>
      </Form.Item>
    </Form>
  );
}
