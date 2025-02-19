import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import { TableListPhoto } from '@components/photo/table-list';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { photoService } from '@services/photo.service';
import Head from 'next/head';
import { useRouter } from 'next/router';

function Photos() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(photoService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo')) return;
    try {
      await photoService.delete(id);
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
        <title>Photos</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Photos' }]} />
      <Page>
        <SearchFilter
          searchWithPerformer
          statuses={statuses}
          onSubmit={handleFilter}
          performerId={`${router?.query?.performerId || ''}`}
          searchWithGallery
          galleryId={`${router?.query?.galleryId || ''}`}
        />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListPhoto
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize)
            }}
            onChange={handleTableChange}
            deletePhoto={handleDelete}
          />
        </div>
      </Page>
    </>
  );
}

export default Photos;
