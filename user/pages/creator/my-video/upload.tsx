import { VideoCameraOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { FormUploadVideo } from '@components/video';
import { showError } from '@lib/utils';
import { videoService } from '@services/video.service';
import { message } from 'antd';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IPerformer } from 'src/interfaces';
import dayjs from 'dayjs';

interface IProps {
  user: IPerformer;
}

interface IFiles {
  fieldname: string;
  file: File;
}

interface IResponse {
  data: { _id: string };
}

function UploadVideo(props: IProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  // eslint-disable-next-line prefer-const
  let _files: {
    thumbnail: File;
    teaser: File;
    video: File;
  } = {
    thumbnail: null,
    teaser: null,
    video: null
  };

  useEffect(() => {
    const { user } = props;
    if (!user || !user.verifiedDocument) {
      message.warning('Your ID documents are not verified yet! You could not post any content right now.');
      Router.back();
    }
  }, []);

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const beforeUpload = (file: File, field: string) => {
    _files[field] = file;
  };

  const submit = async (data: any) => {
    if (!_files.video) {
      message.error('Please select video!');
      return;
    }
    const submitData = { ...data };
    if ((data.isSale && !data.price) || (data.isSale && data.price < 1)) {
      message.error('Invalid price');
      return;
    }
    if ((data.isSchedule && !data.scheduledAt) || (data.isSchedule && dayjs(data.scheduledAt).isBefore(dayjs()))) {
      message.error('Invalid schedule date');
      return;
    }
    submitData.tags = data.tags;
    submitData.participantIds = data.participantIds;
    const files = Object.keys(_files).reduce((f, key) => {
      if (_files[key]) {
        f.push({
          fieldname: key,
          file: _files[key] || null
        });
      }
      return f;
    }, [] as IFiles[]) as [IFiles];

    setUploading(true);

    try {
      await videoService.uploadVideo(
        files,
        data,
        onUploading
      );
      message.success('Your video has been uploaded');
      Router.replace('/creator/my-video');
    } catch (e) {
      showError(e);
    } finally {
      setUploading(false);
    }
  };

  const { user } = props;
  return (
    <>
      <SeoMetaHead pageTitle="Upload Video" />
      <div className="main-container">
        <PageHeading title="Upload Video" icon={<VideoCameraOutlined />} />
        <FormUploadVideo
          user={user}
          submit={submit}
          beforeUpload={beforeUpload}
          uploading={uploading}
          uploadPercentage={uploadPercentage}
        />
      </div>
    </>
  );
}

UploadVideo.authenticate = true;
UploadVideo.onlyPerformer = true;

const mapStates = (state: any) => ({
  user: state.user.current
});
export default connect(mapStates)(UploadVideo);
