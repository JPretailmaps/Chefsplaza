import Head from 'next/head';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { videoService } from '@services/video.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListVideo } from '@components/video/table-list';
import { BreadcrumbComponent } from '@components/common';
import { isMobile } from 'react-device-detect';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { useRouter } from 'next/router';

interface IProps {
  performerId: string;
}

function Videos({ performerId }: IProps) {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(videoService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  const deleteVideo = async (id: string, page) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    try {
      await videoService.delete(id);
      message.success('Deleted successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  const statuses = [
    {
      key: '',
      text: 'All statuses'
    },
    {
      key: 'active',
      text: 'Active'
    },
    {
      key: 'inactive',
      text: 'Inactive'
    }
  ];

  return (
    <>
      <Head>
        <title>Videos</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Videos' }]} />
      <Page>
        <SearchFilter
          searchWithPerformer
          statuses={statuses}
          onSubmit={handleFilter}
          performerId={performerId || ''}
        />
        <div className="table-responsive">
          <TableListVideo
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize),
              position: ['bottomCenter'],
              simple: isMobile
            }}
            onChange={handleTableChange}
            deleteVideo={deleteVideo}
          />
        </div>
      </Page>
    </>
  );
}

Videos.getInitialProps = async (ctx) => ctx.query;

export default Videos;
