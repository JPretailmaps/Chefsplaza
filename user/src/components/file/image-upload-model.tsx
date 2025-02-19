/* eslint-disable react/require-default-props */
import { LoadingOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import getConfig from 'next/config';
import { useState } from 'react';
import style from './image-upload-model.module.scss';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IProps {
  onFileReaded?: Function;
}

export function ImageUploadModel({ onFileReaded }: IProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const beforeUpload = (file) => {
    if (!file.type.includes('image')) {
      message.error('Please select an image file');
      return false;
    }
    const { publicRuntimeConfig: config } = getConfig();
    const isLt5M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 20);
    if (!isLt5M) {
      message.error(`Image is too large; please provide an image ${config.MAX_SIZE_IMAGE || 20}MB or below`);
      return false;
    }
    getBase64(file, () => {
      setLoading(false);
    });
    onFileReaded && onFileReaded(file);
    return true;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <CloudUploadOutlined style={{ fontSize: '36px', color: '#76c539' }} />}
    </div>
  );

  return (
    <Upload
      customRequest={() => false}
      accept="image/*"
      name="file"
      listType="picture-card"
      className={style['avatar-uploader']}
      showUploadList={false}
      beforeUpload={(file) => beforeUpload(file)}
    >
      {uploadButton}
    </Upload>
  );
}
