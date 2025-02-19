import { ReadOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { IPostResponse } from '@interfaces/post';
import { postService } from '@services/post.service';
import { NextPageContext } from 'next';
import style from './style.module.scss';

interface IProps {
  post: IPostResponse;
}

function PostDetail({
  post
}: IProps) {
  return (
    <>
      <SeoMetaHead pageTitle={post?.title || ''} />
      {/* <Script src="//cdn.iframe.ly/embed.js?api_key=7c5c0f5ad6ebf92379ec3e" /> */}
      <div className="main-container">
        <PageHeading title={post?.title || 'Page was not found'} icon={<ReadOutlined />} />
        <div
          className={style['page-content']}
            // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
      </div>
    </>
  );
}

PostDetail.authenticate = true;
PostDetail.noredirect = true;

PostDetail.getInitialProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  try {
    const post = await (await postService.findById(`${query.id}`)).data;
    return { post };
  } catch {
    return { notFound: true };
  }
};

export default PostDetail;
