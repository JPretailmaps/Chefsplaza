import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
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
  // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  // if (!isJpgOrPng) {
  //   message.error("You can only upload JPG/PNG file!");
  // }
  const { publicRuntimeConfig: config } = getConfig();
  const isLt2M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
  if (!isLt2M) {
    message.error(`Avatar must be less than ${config.MAX_SIZE_IMAGE || 5}MB`);
  }
  return isLt2M;
}

interface IProps {
  image?: string;
  uploadUrl?: string;
  onUploaded?: Function;
}

export function AvatarUpload({
  image, uploadUrl, onUploaded
}: IProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(image || '/no-avatar.jpg');

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url: string) => {
        setImageUrl(url);
        setLoading(false);
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: url
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
    <div className="upload-avatar__customize">
      <ImgCrop rotationSlider cropShape="round" quality={1} modalTitle="Edit Avatar" modalWidth={767}>
        <Upload
          accept="image/*"
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={uploadUrl}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onPreview={onPreview}
          headers={{ authorization: authService.getToken() }}
        >
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: '100%', height: '100%', maxWidth: 104, maxHeight: 104
            }}
          />
          {loading ? <LoadingOutlined /> : <CameraOutlined />}
        </Upload>
      </ImgCrop>
    </div>
  );
}

AvatarUpload.defaultProps = {
  onUploaded: () => {},
  uploadUrl: '',
  image: ''
};
