import { UploadOutlined } from '@ant-design/icons';
import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { SelectGalleryDropdown } from '@components/gallery/common/select-gallery-dropdown';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { photoService } from '@services/photo.service';
import {
  Button,
  Col,
  Form,
  Input, Row,
  Select, Upload,
  message
} from 'antd';
import getConfig from 'next/config';
import Head from 'next/head';
import Router from 'next/router';
import {
  useReducer,
  useRef,
  useState
} from 'react';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

const { Dragger } = Upload;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

interface IProps {
  galleryId: string;
}

function BulkUploadPhoto({ galleryId }: IProps) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedPerformerId, setSelectedPerformerId] = useState('');

  const [formRef] = Form.useForm();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // useEffect(() => {
  //   if (!formRef.current) formRef.current = createRef();
  // }, []);

  const onUploading = (file: any, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    forceUpdate();
  };

  const setFormVal = (field: string, val: any) => {
    formRef.setFieldsValue({
      [field]: val
    });
    if (field === 'performerId') setSelectedPerformerId(val);
  };

  const beforeUpload = (file: any, listFile: any[]) => {
    const { publicRuntimeConfig: config } = getConfig();
    if (file.size / 1024 / 1024 > (config.MAX_SIZE_IMAGE || 5)) {
      message.error(`${file.name} is over ${config.MAX_SIZE_IMAGE || 5}MB`);
      return false;
    }
    getBase64(file, (imageUrl) => {
      // eslint-disable-next-line no-param-reassign
      file.thumbUrl = imageUrl;
    });
    const newFileList = [...fileList, ...listFile.filter((f) => f.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5))];
    setFileList(newFileList);
    return true;
  };

  const remove = (file: any) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
  };

  const submit = async (data: any) => {
    const uploadFiles = fileList.filter((f) => !['uploading', 'done'].includes(f.status));
    if (!data.performerId) {
      message.error('Please select creator!');
      return;
    }
    if (!data.galleryId) {
      message.error('Please select gallery!');
      return;
    }
    if (!uploadFiles.length) {
      message.error('Please select new file!');
      return;
    }
    setUploading(true);

    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(file.status)) continue;
        file.status = 'uploading';
        // eslint-disable-next-line no-await-in-loop
        await photoService.uploadPhoto(file, data, onUploading.bind(this, file));
        file.status = 'done';
        file.response = { status: 'success' };
      } catch (e) {
        file.status = 'error';
        message.error(`File ${file.name} error!`);
      }
    }
    message.success('Photos has been uploaded!');
    Router.push('/photos');
  };

  return (
    <>
      <Head>
        <title>Bulk Upload Photos</title>
      </Head>
      <Page>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Photos' }]} />
        <Form
          {...layout}
          onFinish={submit}
          validateMessages={validateMessages}
          form={formRef}
          initialValues={{
            status: 'active',
            performerId: selectedPerformerId,
            galleryId: galleryId || ''
          }}
        >
          <Row>
            <Col md={12} xs={12}>
              <Form.Item name="performerId" label="Performer" rules={[{ required: true }]}>
                <SelectPerformerDropdown
                  onSelect={(val) => setFormVal('performerId', val)}
                  disabled={uploading}
                  defaultValue=""
                />
              </Form.Item>
            </Col>
            <Col md={12} xs={12}>
              <Form.Item
                name="galleryId"
                label="Gallery"
                rules={[{ required: true, message: 'Please select a gallery' }]}
              >
                <SelectGalleryDropdown
                  performerId={selectedPerformerId}
                  onSelect={(val) => setFormVal('galleryId', val)}
                  defaultValue={galleryId || ''}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select disabled={uploading}>
              <Select.Option key="active" value="active">
                Active
              </Select.Option>
              <Select.Option key="inactive" value="inactive">
                Inactive
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Dragger
              accept="image/*"
              beforeUpload={beforeUpload}
              multiple
              showUploadList
              fileList={fileList}
              onRemove={remove}
              disabled={uploading}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag and drop files to this area to upload image files only</p>
            </Dragger>
          </Form.Item>
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading}>
              UPLOAD ALL
            </Button>
          </Form.Item>
        </Form>
      </Page>
    </>
  );
}

export default BulkUploadPhoto;
