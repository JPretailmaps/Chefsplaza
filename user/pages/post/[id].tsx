import { ArrowLeftOutlined } from '@ant-design/icons';
import SeoMetaHead from '@components/common/seo-meta-head';
import {
  IFeed
} from '@interfaces/index';
import { feedService } from '@services/index';
import nextCookie from 'next-cookies';
import FeedCard from '@components/post/card/feed-card';
import PageHeading from '@components/common/page-heading';
import { NextPageContext } from 'next/types';

interface IProps {
  feed: IFeed;
  previousRoute: string;
}

function PostDetails({
  feed, previousRoute
}: IProps) {
  return (
    <>
      <SeoMetaHead pageTitle={`${feed?.slug || ''}`} />
      <div className="main-container">
        {previousRoute && <PageHeading title="Back" icon={<ArrowLeftOutlined />} />}
        <div className="main-container">
          <FeedCard feed={feed} />
        </div>
      </div>
    </>
  );
}

PostDetails.authenticate = true;
PostDetails.noredirect = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const res = await feedService.findOne(`${ctx.query.id}`, {
      Authorization: token || ''
    });

    const previousRoute = ctx.req.headers?.referer || null;
    return {
      props: {
        feed: res.data,
        previousRoute
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default PostDetails;
