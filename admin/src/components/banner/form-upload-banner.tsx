import {
  Form, Input, Select, Upload, Button, message, Progress
} from 'antd';
import { IBanner } from 'src/interfaces';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import getConfig from 'next/config';
import { bannerService } from '@services/banner.service';
import { useRef, useState } from 'react';
import Router from 'next/router';
import { showError } from '@lib/message';

interface IProps {
  banner?: IBanner;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export function FormUploadBanner({ banner = null }: IProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const _banner = useRef(null);

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const submit = async (data: any) => {
    if (!banner && !_banner.current) {
      message.error('Please select a banner!');
      return;
    }
    setUploading(true);
    try {
      !banner && await bannerService.uploadBanner(_banner.current, data, onUploading);
      banner && await bannerService.update(banner._id, data);
      message.success('Banner has been uploaded');
      Router.push('/banners');
    } catch (e) {
      showError(e);
      setUploading(false);
    }
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const beforeUpload = (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const isMaxSize = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
    if (!isMaxSize) {
      message.error(`Image must be smaller than ${config.MAX_SIZE_IMAGE || 5}MB!`);
      return false;
    }
    _banner.current = file;
    return true;
  };

  const handleChange = (info) => {
    beforeUpload(info.file.originFileObj);
  };

  return (
    <Form
      {...layout}
      onFinish={(data) => submit(data)}
      onFinishFailed={() => message.error('Please complete the required fields')}
      name="form-upload-banner"
      validateMessages={validateMessages}
      initialValues={
        banner || ({
          title: '',
          description: '',
          link: '',
          status: 'active',
          position: 'top'
        })
      }
    >
      <Form.Item name="title" rules={[{ required: true, message: 'Please input title of banner!' }]} label="Title">
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="link"
        label="Direct link"
        rules={[
          // eslint-disable-next-line no-useless-escape
          { pattern: /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/, message: 'Invalid url format' }
        ]}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please select position!' }]}>
          <Select>
            <Select.Option key="top" value="top">
              Top
            </Select.Option>
            <Select.Option key="middle" value="middle">
              Middle
            </Select.Option>
            <Select.Option key="bottom" value="bottom">
              Bottom
            </Select.Option>
              <Select.Option key="left" value="left">
              Left
            </Select.Option>
              <Select.Option key="right" value="right">
              Right
            </Select.Option>
          </Select>
        </Form.Item> */}
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
      <Form.Item label="Banner" help="Ratio dimension 4:1 (eg: 1600px:400px)">
        {banner ? <img src={banner?.photo?.url || './banner-image.jpg'} alt="banner" style={{ width: '100%' }} /> : (
          <ImgCrop aspect={1600 / 400} cropShape="rect" quality={1} modalTitle="Edit banner" modalWidth={768}>
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList
              multiple={false}
              onChange={handleChange}
              onPreview={onPreview}
              disabled={uploading}
            >
              {uploading ? <LoadingOutlined /> : <UploadOutlined />}
            </Upload>
          </ImgCrop>
        )}
      </Form.Item>
      {uploadPercentage ? <Progress percent={Math.round(uploadPercentage)} /> : null}
      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading}>
          {banner ? 'Update' : 'Upload'}
        </Button>
      </Form.Item>
    </Form>
  );
}
