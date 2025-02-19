import SeoMetaHead from '@components/common/seo-meta-head';
import { IUser } from '@interfaces/user';
import { userService } from '@services/user.service';
import nextCookie from 'next-cookies';
import dynamic from 'next/dynamic';

const GoLiveWrapper = dynamic(() => import('@components/streaming/go-live/go-live-wrapper'), { ssr: false });

type IPrps = {
  user: IUser;
};

function GoLive({
  user
}: IPrps) {
  return (
    <>
      <SeoMetaHead pageTitle="Go Live" />
      <GoLiveWrapper />
    </>
  );
}

GoLive.authenticate = true;
GoLive.onlyPerformer = true;

export const getServerSideProps = async (ctx) => {
  // check profile if not yet to be verified by admin
  try {
    const { token } = nextCookie(ctx);
    const resp = await userService.me({
      Authorization: token || ''
    });
    const user = resp.data;

    if (!user.verifiedDocument) {
      const path = `/creator/account?msg=${encodeURI('Your account is not verified ID documents yet! You could not post any content right now.')}`;
      return {
        redirect: {
          permanent: false,
          destination: path
        }
      };
    }

    return {
      props: {
        user
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default GoLive;
