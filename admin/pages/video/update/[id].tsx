import { BreadcrumbComponent } from '@components/common';
import Loader from '@components/common/base/loader';
import Page from '@components/common/layout/page';
import { FormUploadVideo } from '@components/video/form-upload-video';
import { videoService } from '@services/video.service';
import { message } from 'antd';
import moment from 'moment';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { IVideo } from 'src/interfaces';

interface IProps {
  id: string;
}

interface IFiles {
  fieldname: string;
  file: File;
}

function VideoUpdate({
  id
}: IProps) {
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [video, setVideo] = useState<IVideo>({} as IVideo);

  const files = {
    thumbnail: null as File,
    video: null as File,
    teaser: null as File
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await videoService.findById(id);
        setVideo(resp.data);
      } catch (e) {
        message.error('Video not found!');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const beforeUpload = (file: File, field: string) => {
    files[field] = file;
  };

  const submit = async (data: IVideo) => {
    if ((data.isSale && !data.price) || (data.isSale && data.price < 1)) {
      message.error('Invalid amount of tokens');
      return;
    }
    if (
      (data.isSchedule && !data.scheduledAt)
      || (data.isSchedule && moment(data.scheduledAt).isBefore(moment()))
    ) {
      message.error('Invalid schedule date');
      return;
    }
    // eslint-disable-next-line no-param-reassign
    data.tags = [...data.tags];
    const filesArr = Object.keys(files).reduce((f, key) => {
      if (files[key]) {
        f.push({
          fieldname: key,
          file: files[key] || null
        });
      }
      return f;
    }, [] as IFiles[]) as [IFiles];

    setUploading(true);
    try {
      await videoService.update(video._id, filesArr, data, onUploading);
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
        <title>Edit Video</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Video', href: '/video' },
          { title: video.title ? video.title : 'Edit video' }
        ]}
      />
      <Page>
        {fetching ? (
          <Loader />
        ) : (
          <FormUploadVideo
            video={video}
            submit={submit}
            uploading={uploading}
            beforeUpload={beforeUpload}
            uploadPercentage={uploadPercentage}
          />
        )}
      </Page>
    </>
  );
}

VideoUpdate.getInitialProps = async (ctx) => ctx.query;

export default VideoUpdate;
