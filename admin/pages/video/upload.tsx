import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { FormUploadVideo } from '@components/video/form-upload-video';
import { videoService } from '@services/video.service';
import { message } from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';
import { IVideo } from 'src/interfaces';

interface IFiles {
  fieldname: string;
  file: File;
}

function UploadVideo() {
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [files, setFiles] = useState({
    thumbnail: null,
    video: null,
    teaser: null
  });

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const beforeUpload = (file: File, field: string) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [field]: file
    }));
  };

  const submit = async (data: IVideo) => {
    if (!files.video) {
      message.error('Please select video!');
      return;
    }
    if ((data.isSale && !data.price) || (data.isSale && data.price < 1)) {
      message.error('Invalid amount of tokens');
      return;
    }
    const uploadFiles: IFiles[] = Object.keys(files)
      .filter((key) => files[key])
      .map((key) => ({
        fieldname: key,
        file: files[key]
      }));

    setUploading(true);
    try {
      await videoService.uploadVideo(uploadFiles as any, data, onUploading);
      message.success('Video has been uploaded');
      Router.push('/video');
    } catch (error) {
      message.error('An error occurred, please try again!');
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload video</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Video', href: '/video' }, { title: 'Upload new video' }]} />
      <Page>
        <FormUploadVideo
          submit={submit}
          beforeUpload={beforeUpload}
          uploading={uploading}
          uploadPercentage={uploadPercentage}
        />
      </Page>
    </>
  );
}

export default UploadVideo;
