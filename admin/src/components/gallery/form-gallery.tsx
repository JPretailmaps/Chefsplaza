import { useEffect, useRef, useState } from 'react';
import {
  Form, Input, Button, Select, InputNumber, Switch
} from 'antd';
import { IGallery } from 'src/interfaces';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { FormInstance } from 'antd/lib/form';

interface IProps {
  gallery?: IGallery;
  onFinish: Function;
  submiting: boolean;
}

export function FormGallery(props: IProps) {
  let formRef: any;

  const [isSale, setIsSale] = useState(false);

  useEffect(() => {
    const { gallery } = props;
    gallery && setIsSale(gallery.isSale);
  }, []);

  const setFormVal = (field: string, val: any) => {
    const instance = formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  };

  if (!formRef) formRef = useRef();
  const { gallery, onFinish, submiting } = props;
  return (
    <Form
      ref={formRef}
      onFinish={onFinish.bind(this)}
      initialValues={
        gallery || ({
          title: '',
          description: '',
          price: 9.99,
          status: 'active',
          performerId: ''
        })
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item name="performerId" label="Creator" rules={[{ required: true }]}>
        <SelectPerformerDropdown
          defaultValue={gallery && gallery.performerId}
          onSelect={(val) => setFormVal('performerId', val)}
        />
      </Form.Item>
      <Form.Item name="title" rules={[{ required: true, message: 'Please input title of gallery!' }]} label="Gallery Title">
        <Input />
      </Form.Item>
      <Form.Item name="isSale" label="For sale?" valuePropName="checked">
        <Switch unCheckedChildren="Subscribe to view" checkedChildren="Pay per view" checked={isSale} onChange={(val) => setIsSale(val)} />
      </Form.Item>
      {isSale && (
        <Form.Item name="price" label="Price">
          <InputNumber min={1} />
        </Form.Item>
      )}
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
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
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

FormGallery.defaultProps = {
  gallery: null
};
