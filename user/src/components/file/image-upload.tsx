import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';

function beforeUpload(file, uploadImmediately = true) {
  const { publicRuntimeConfig: config } = getConfig();
  const isLt5M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
  if (!isLt5M) {
    message.error(`Image is too large please provide an image ${config.MAX_SIZE_IMAGE || 5}MB or below`);
  }
  return uploadImmediately;
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  accept?: string;
  imageUrl?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  onFileReaded?: Function;
  options?: any;
  uploadImmediately?: boolean;
}

export function ImageUpload({
  options = {}, accept, headers, uploadUrl, uploadImmediately, imageUrl, onFileReaded, onUploaded
}: IProps) {
  const [url, setUrl] = useState(imageUrl);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    imageUrl && setUrl(imageUrl);
  }, [imageUrl]);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      onFileReaded && onFileReaded(info.file.originFileObj);
      onUploaded && onUploaded({
        response: info.file.response
      });
      setLoading(false);
      setUrl(info.file.response.data ? info.file.response.data.url : 'Done!');
    }
  };

  return (
    <Upload
      accept={accept || 'image/*'}
      name={options.fieldName || 'file'}
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={uploadUrl}
      beforeUpload={(file) => beforeUpload(file, typeof uploadImmediately === 'boolean' ? uploadImmediately : true)}
      onChange={handleChange}
      headers={headers}
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {url ? (
        <img src={imageUrl} alt="file" style={{ width: '100%' }} />
      ) : (
        loading ? <LoadingOutlined /> : <CameraOutlined />
      )}
    </Upload>
  );
}

ImageUpload.defaultProps = {
  accept: null,
  options: {},
  imageUrl: '',
  uploadUrl: '',
  headers: {},
  onUploaded: () => {},
  onFileReaded: () => {},
  uploadImmediately: false
};
