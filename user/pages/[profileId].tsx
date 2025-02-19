import SeoMetaHead from '@components/common/seo-meta-head';
import { IPerformer } from '@interfaces/performer';
import { performerService } from '@services/performer.service';
import { Result, message } from 'antd';
import { useRouter } from 'next/router';
import nextCookie from 'next-cookies';
import { useEffect, useState } from 'react';
import { NextPageContext } from 'next/types';
import dynamic from 'next/dynamic';
import { IError } from '@interfaces/setting';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const ProfileContainer = dynamic(() => import('@components/performer/profile/profile-container'));

type IProps = {
  performer: IPerformer;
  previousRoute: string;
  error: IError;
};

function Profile({
  performer, previousRoute, error
}: IProps) {
  const router = useRouter();
  const [err, setErr] = useState(error);

  useEffect(() => {
    if (router.query.msg) {
      message.info(router.query.msg);
    }
    if (error || (router.query.message && router.query.statusCode)) {
      setErr({
        statusCode: error?.statusCode || parseInt(`${router.query.statusCode || '404'}`, 10),
        message: (error?.message || router.query.message) as string
      });
    }
  }, [router.query, error]);

  if (err) {
    return (
      <Result
        status={err?.statusCode as any || 404}
        title={err?.message || 'Not found'}
      />
    );
  }

  return (
    <>
      <SeoMetaHead
        canonicalUrl={`${publicRuntimeConfig.SITE_URL}${router.asPath}`}
        item={performer}
        imageUrl={performer?.avatar}
      />
      <ProfileContainer
        performer={performer}
        previousRoute={previousRoute}
      />
    </>
  );
}

Profile.authenticate = true;
Profile.noredirect = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { query } = ctx;
    const { token } = nextCookie(ctx);
    const performer = await performerService.findOne(`${query.profileId}`, {
      Authorization: token || '',
      baseEndpoint: publicRuntimeConfig.API_ENDPOINT
    });
    const previousRoute = ctx?.req?.headers?.referer || null;
    return {
      props: {
        performer: performer?.data,
        previousRoute
      }
    };
  } catch (e) {
    return {
      props: {
        error: await e
      }
    };
  }
};

export default Profile;
