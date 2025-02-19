import { ArrowLeftOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import FeedForm from '@components/post/form';
import { IFeed } from '@interfaces/index';
import { feedService } from '@services/index';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import SeoMetaHead from '@components/common/seo-meta-head';
import { NextPageContext } from 'next/types';

interface IProps {
  feed: IFeed;
}

function EditPost({ feed }: IProps) {
  return (
    <>
      <SeoMetaHead pageTitle="Edit Post" />
      <div className="main-container">
        <PageHeading icon={<ArrowLeftOutlined />} title=" Edit Post" action={() => Router.push('/creator/my-post')} />
        <div>
          <FeedForm feed={feed} type={feed.type} />
        </div>
      </div>
    </>
  );
}

EditPost.authenticate = true;
EditPost.onlyPerformer = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const feed = await (await feedService.findById(`${ctx.query.id}`, { Authorization: token || '' })).data;
    return {
      props: {
        feed
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default EditPost;
