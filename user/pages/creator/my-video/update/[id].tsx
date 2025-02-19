import { VideoCameraOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { FormUploadVideo } from '@components/video/form-upload';
import { showError } from '@lib/utils';
import { videoService } from '@services/video.service';
import { message, Spin } from 'antd';
import dayjs from 'dayjs';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IPerformer, IVideo } from 'src/interfaces';

interface IProps {
  id: string;
  user: IPerformer;
}

interface IFiles {
  fieldname: string;
  file: File;
}

function VideoUpdate(props: IProps) {
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [video, setVideo] = useState<IVideo>();

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

  const findVideo = async () => {
    try {
      const { id } = props;
      const resp = await videoService.findById(id);
      setVideo(resp.data);
    } catch (e) {
      message.error('Video not found!');
      Router.back();
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    findVideo();
  }, []);

  const onUploading = (resp: any) => {
    setUploadPercentage(resp.percentage);
  };

  const beforeUpload = (file: File, field: string) => {
    _files[field] = file;
  };

  const submit = async (data: any) => {
    const submitData = { ...data };
    if ((data.isSale && !data.price) || (data.isSale && data.price < 1)) {
      message.error('Invalid price');
      return;
    }
    if ((data.isSchedule && !data.scheduledAt) || (data.isSchedule && dayjs(data.scheduledAt).isBefore(dayjs()))) {
      message.error('Invalid schedule date');
      return;
    }
    submitData.tags = [...data.tags];
    submitData.participantIds = [...data.participantIds];
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
      await videoService.update(
        video._id,
        files,
        data,
        onUploading
      );

      message.success('Your video has been updated');
      Router.push('/creator/my-video');
    } catch (e) {
      showError(e);
    } finally {
      setUploading(false);
    }
  };

  const { user } = props;
  return (
    <>
      <SeoMetaHead pageTitle="Edit Video" />
      <div className="main-container">
        <PageHeading title="Edit Video" icon={<VideoCameraOutlined />} />
        {!fetching && video && (
          <FormUploadVideo
            user={user}
            video={video}
            submit={submit}
            uploading={uploading}
            beforeUpload={beforeUpload}
            uploadPercentage={uploadPercentage}
          />
        )}
        {fetching && <div className="text-center"><Spin /></div>}
      </div>
    </>
  );
}

VideoUpdate.authenticate = true;

VideoUpdate.onlyPerformer = true;

VideoUpdate.getInitialProps = async (ctx) => ctx.query;

const mapStates = (state: any) => ({
  user: state.user.current
});
export default connect(mapStates)(VideoUpdate);
