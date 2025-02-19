import SeoMetaHead from '@components/common/seo-meta-head';
import VideoDetailsWrapper from '@components/video/details/video-details-wrapper';
import { IVideo } from '@interfaces/video';
import { videoService } from '@services/video.service';
import { NextPageContext } from 'next/types';
import nextCookie from 'next-cookies';

type Props = {
  video: IVideo;
};

function VideoDetail({
  video
}: Props) {
  return (
    <>
      <SeoMetaHead item={video} />
      <VideoDetailsWrapper video={video} />
    </>
  );
}

VideoDetail.authenticate = true;
VideoDetail.noredirect = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { id } = ctx.query;
    const { token = '' } = nextCookie(ctx);
    const res = await videoService.findOne(`${id}`, {
      Authorization: token
    });
    return {
      props: {
        video: res.data
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default VideoDetail;
