import { UploadOutlined } from '@ant-design/icons';
import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import VideoUploadList from '@components/file/video-upload-list';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { videoService } from '@services/video.service';
import {
  Button, Form, Upload, message
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import getConfig from 'next/config';
import Head from 'next/head';
import Router from 'next/router';
import { useRef, useState } from 'react';

const { Dragger } = Upload;

const validateMessages = {
  required: 'This field is required!'
};

interface IProps {
  performerId: string;
}

function BulkUploadVideo({ performerId }: IProps) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const formRef = useRef<FormInstance>();

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    setFileList([...fileList]);
  };

  const setFormVal = (field: string, val: any) => {
    const instance = formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  };

  const beforeUpload = (file, listFile) => {
    const { publicRuntimeConfig: config } = getConfig();
    if (file.size / 1024 / 1024 > (config.MAX_SIZE_VIDEO || 2000)) {
      message.error(`${file.name} is over ${config.MAX_SIZE_VIDEO || 2000}MB`);
      return false;
    }
    setFileList([...fileList, ...listFile.filter((f) => f.size / 1024 / 1024 < (config.MAX_SIZE_VIDEO || 2000))]);
    return true;
  };

  const remove = (file) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid));
  };

  const submit = async (formValues: any) => {
    const uploadFiles = fileList.filter((f) => !['uploading', 'done'].includes(f.status));
    if (!uploadFiles.length) {
      message.error('Please select new video!');
      return;
    }
    await setUploading(true);
    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(file.status)) continue;
        file.status = 'uploading';
        // eslint-disable-next-line no-await-in-loop
        await videoService.uploadVideo(
          [
            {
              fieldname: 'video',
              file
            }
          ],
          {
            title: file.name,
            price: 0,
            description: '',
            tags: [],
            isSale: false,
            isSchedule: false,
            status: 'inactive',
            participantIds: [formValues.performerId],
            performerId: formValues.performerId
          },
          onUploading.bind(this, file)
        );
        file.status = 'done';
      } catch (e) {
        message.error(`File ${file.name} error!`);
        file.status = 'error';
      }
    }
    message.success('Files has been uploaded!');
    Router.push('/video');
  };

  return (
    <>
      <Head>
        <title>Bulk upload video</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Videos', href: '/video' }, { title: 'Bulk upload video' }]} />
      <Page>
        <Form
          layout="vertical"
          onFinish={submit}
          validateMessages={validateMessages}
          ref={formRef}
          initialValues={{
            status: 'inactive',
            performerId: performerId || ''
          }}
        >
          <Form.Item name="performerId" label="Creator" rules={[{ required: true }]}>
            <SelectPerformerDropdown
              onSelect={(val) => setFormVal('performerId', val)}
              disabled={uploading}
              defaultValue={performerId || ''}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Dragger
              accept="video/*"
              beforeUpload={beforeUpload}
              multiple
              showUploadList={false}
              disabled={uploading}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag and drop files to this area to upload video file only</p>
            </Dragger>
            <VideoUploadList files={fileList} remove={remove} />
          </Form.Item>
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading || !fileList.length}>
              UPLOAD ALL
            </Button>
          </Form.Item>
        </Form>
      </Page>
    </>
  );
}

export default BulkUploadVideo;
