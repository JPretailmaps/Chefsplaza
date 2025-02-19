import Head from 'next/head';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { BreadcrumbComponent } from '@components/common';
import FormFeed from '@components/feed/feed-form';
import { feedService } from '@services/feed.service';
import Router from 'next/router';
import { IFeed } from 'src/interfaces';
import { showError } from '@lib/message';
import { NextPageContext } from 'next/types';
import nextCookie from 'next-cookies';

interface IProps {
  feed: IFeed;
}

function FeedUpdate({ feed }: IProps) {
  const deleteFeed = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await feedService.delete(feed._id);
      message.success('Deleted successfully');
      Router.back();
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Post</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Posts', href: '/feed' },
          { title: 'Edit' }
        ]}
      />
      <Page>
        <FormFeed
          onDelete={deleteFeed}
          feed={feed}
        />
      </Page>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { id } = ctx.query;
  const { token } = nextCookie(ctx);
  const resp = await feedService.findById(`${id}`, {
    Authorization: token || ''
  });
  return {
    props: {
      feed: resp.data
    }
  };
};

export default FeedUpdate;
