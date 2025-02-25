import { Upload, message } from 'antd';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';
import { PureComponent } from 'react';
import getConfig from 'next/config';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  // const ext = file.name.split('.').pop().toLowerCase();
  // const isImageAccept = env.imageAccept
  //   .split(',')
  //   .map((item: string) => item.trim())
  //   .indexOf(`.${ext}`);
  // if (isImageAccept === -1) {
  //   message.error(`You can only upload ${env.imageAccept} file!`);
  // }
  const { publicRuntimeConfig: config } = getConfig();
  const isMaxSize = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
  if (!isMaxSize) {
    message.error(`Image must smaller than ${config.MAX_SIZE_IMAGE || 5}MB!`);
    return false;
  }
  return true;
}

interface IState {
  loading: boolean;
  imageUrl: string;
}

interface IProps {
  image?: string;
  uploadUrl?: string;
  headers?: any;
  onUploaded?: Function;
  options?: any;
}

export class ImageUpload extends PureComponent<IProps, IState> {
  state = {
    loading: false,
    imageUrl: ''
  };

  handleChange = (info) => {
    const { onUploaded } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.setState({
          imageUrl,
          loading: false
        });
        onUploaded
          && onUploaded({
            response: info.file.response,
            base64: imageUrl
          });
      });
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const {
      options = {}, image, headers, uploadUrl
    } = this.props;
    return (
      <Upload
        accept={'image/*'}
        name={options.fieldName || 'file'}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        headers={headers}
      >
        {(imageUrl || image) && <img src={imageUrl || image} alt="file" style={{ width: '100%' }} />}
        {loading ? <LoadingOutlined /> : <CameraOutlined />}
      </Upload>
    );
  }
}
