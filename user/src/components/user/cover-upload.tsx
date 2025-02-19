import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import { authService } from '@services/auth.service';
import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import getConfig from 'next/config';
import { useState } from 'react';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const { publicRuntimeConfig: config } = getConfig();
  const isLt2M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
  if (!isLt2M) {
    message.error(`Cover must be less than ${config.MAX_SIZE_IMAGE || 5}MB`);
  }
  return isLt2M;
}

interface IProps {
  image?: string;
  uploadUrl?: string;
  onUploaded?: Function;
  options?: any;
}

export function CoverUpload({
  image, uploadUrl, onUploaded, options
}: IProps) {
  const [uploading, setUploading] = useState(false);
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setUploading(false);
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: imageUrl
          });
      });
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
    const img = new Image();
    img.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(img.outerHTML);
  };

  return (
    <ImgCrop aspect={1076 / 230} cropShape="rect" quality={1} modalTitle="Edit cover image" modalWidth={767}>
      <Upload
        accept="image/*"
        name={options.fieldName || 'file'}
        listType="picture-card"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={onPreview}
        headers={{ authorization: authService.getToken() }}
      >
        {uploading ? <LoadingOutlined /> : <EditOutlined />}
        {' '}
        Edit cover
      </Upload>
    </ImgCrop>
  );
}

CoverUpload.defaultProps = {
  image: '',
  uploadUrl: '',
  onUploaded: '',
  options: {}
};

export default CoverUpload;
