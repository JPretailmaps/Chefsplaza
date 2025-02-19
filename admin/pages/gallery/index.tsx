import Head from 'next/head';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { galleryService } from '@services/gallery.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListGallery } from '@components/gallery/table-list';
import { BreadcrumbComponent } from '@components/common';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/message';

const statuses = [
  {
    key: '',
    text: 'All'
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

function Galleries() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(galleryService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  const deleteGallery = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this album?')) {
      return;
    }
    try {
      await galleryService.delete(id);
      message.success('Deleted successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <Head>
        <title>Galleries</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Galleries' }]} />
      <Page>
        <SearchFilter
          keyword
          searchWithPerformer
          statuses={statuses}
          onSubmit={handleFilter}
          performerId={`${router?.query?.performerId || ''}`}
        />
        <div className="table-responsive">
          <TableListGallery
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize)
            }}
            onChange={handleTableChange}
            deleteGallery={deleteGallery}
          />
        </div>
      </Page>
    </>
  );
}

export default Galleries;
