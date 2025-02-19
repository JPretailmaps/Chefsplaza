import {
  CalendarOutlined,
  EyeOutlined, HourglassOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import { IVideo } from '@interfaces/video';
import { formatDate } from '@lib/date';
import { videoDuration } from '@lib/duration';
import { shortenLargeNumber } from '@lib/number';
import dynamic from 'next/dynamic';
import style from './video-details-wrapper.module.scss';
import VideoMiddleWrapper from './video-middle-wrapper';

const VideoDetailPlayer = dynamic(() => import('./video-player'));

type Props = {
  video: IVideo
};

function VideoDetailsWrapper({
  video
}: Props) {
  return (
    <div className="main-container">
      <PageHeading icon={<VideoCameraOutlined />} title={video.title || 'Video'} />
      <div className={style['vid-duration']}>
        <span className={style.stats}>
          <HourglassOutlined />
          &nbsp;
          {videoDuration(video?.video?.duration || 0)}
          &nbsp;&nbsp;&nbsp;
          <EyeOutlined />
          &nbsp;
          {shortenLargeNumber(video.stats.views || 0)}
        </span>
        <span className={style.stats}>
          <CalendarOutlined />
          &nbsp;
          {formatDate(video.updatedAt, 'll')}
        </span>
      </div>
      <VideoDetailPlayer video={video} />
      <VideoMiddleWrapper video={video} />
    </div>
  );
}

export default VideoDetailsWrapper;
