import Head from 'next/head';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { feedService } from '@services/feed.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListFeed } from '@components/feed/table-list';
import { BreadcrumbComponent } from '@components/common';
import { showError } from '@lib/message';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';

const types = [
  { key: '', text: 'All Posts' },
  { key: 'video', text: 'Video' },
  { key: 'photo', text: 'Photo' },
  { key: 'text', text: 'Text' },
  { key: 'scheduled-streaming', text: 'Scheduled streaming' }
];

function Feeds() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(feedService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const handleDelete = async (id: string) => {
    if (!window.confirm('All earnings related to this post will be refunded. Are you sure to remove it?')) {
      return;
    }
    try {
      await feedService.delete(id);
      message.success('Post deleted successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  if (error) {
    showError(error);
  }

  return (
    <>
      <Head>
        <title>Newsfeed Posts</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Newsfeed Posts' }]} />
      <Page>
        <SearchFilter
          onSubmit={handleFilter}
          dateRange
          type={types}
          searchWithPerformer
          performerId={`${router?.query?.performerId || ''}`}
          defaultType={`${router?.query?.type || ''}`}
        />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListFeed
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              current: Number(current),
              total: data?.total || 0,
              pageSize: Number(pageSize)
            }}
            onChange={handleTableChange}
            deleteFeed={handleDelete}
          />
        </div>
      </Page>
    </>
  );
}

export default Feeds;
