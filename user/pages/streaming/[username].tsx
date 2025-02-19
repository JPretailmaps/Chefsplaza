import nextCookie from 'next-cookies';
import { performerService } from '@services/performer.service';
import { streamService } from '@services/stream.service';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next/types';
import { IPerformer } from '@interfaces/performer';
import { IStream } from '@interfaces/stream';
import SeoMetaHead from '@components/common/seo-meta-head';
import { IConversation } from '@interfaces/message';

const ViewerLiveWrapper = dynamic(() => import('@components/streaming/viewer/viewer-live-wrapper'), { ssr: false });

interface P {
  performer: IPerformer;
  stream: IStream;
  conversation: IConversation;
}

function UserStreaming({ performer, stream, conversation }: P) {
  return (
    <>
      <SeoMetaHead pageTitle={`Live streaming of ${performer?.username}`} />
      <ViewerLiveWrapper
        performer={performer}
        stream={stream}
        conversation={conversation}
      />
    </>
  );
}

UserStreaming.layout = 'stream';
UserStreaming.authenticate = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { query } = ctx;
    const { token } = nextCookie(ctx);
    const headers = { Authorization: token || '' };
    const resp = await performerService.findOne(
      `${query.username}`,
      headers
    );
    const performer = resp.data;
    if (!performer.isSubscribed) {
      return {
        redirect: {
          permanent: false,
          destination: `/${performer.username}?msg=${encodeURI('Please subscribe to join live chat!')}`
        }
      };
    }

    try {
      const response = await streamService.joinPublicChat(performer._id, headers);
      return {
        props: {
          performer,
          stream: response.data.stream,
          conversation: response.data.conversation
        }
      };
    } catch (e) {
      return {
        redirect: {
          permanent: false,
          destination: `/${performer.username}?msg=${encodeURI("Creator hasn't started streaming!")}`
        }
      };
    }
  } catch (e) {
    return { notFound: true };
  }
};

export default UserStreaming;
