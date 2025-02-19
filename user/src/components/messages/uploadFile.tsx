import { LoadingOutlined, PaperClipOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import getConfig from 'next/config';
import { useState } from 'react';

import style from './uploadFile.module.scss';

function beforeUpload(file) {
  const { publicRuntimeConfig: config } = getConfig();
  const isLt5M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
  if (!isLt5M) {
    message.error(`File is too large please provide an file ${config.MAX_SIZE_IMAGE || 5}MB or below`);
  }
  return isLt5M;
}

interface IProps {
  uploadUrl?: string;
  headers?: any;
  onUploaded: Function;
  options?: any;
  messageData?: any;
  disabled?: boolean;
}

function FileMessageUpload({
  uploadUrl,
  headers,
  onUploaded,
  options,
  messageData,
  disabled
}: IProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      onUploaded && onUploaded({
        response: info.file.response
      });
    }
  };

  return (
    <Upload
      disabled={loading || disabled}
      accept={'image/*, video/*'}
      name={options.fieldName || 'file'}
      className={style['avatar-uploader']}
      showUploadList={false}
      action={uploadUrl}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      headers={headers}
      data={messageData}
    >
      <div className={style['upload-icon']}>
        {loading ? <LoadingOutlined /> : <PaperClipOutlined />}
      </div>
    </Upload>
  );
}

FileMessageUpload.defaultProps = {
  uploadUrl: null,
  headers: null,
  options: null,
  messageData: null,
  disabled: null
};

export default FileMessageUpload;
