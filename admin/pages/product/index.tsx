import Head from 'next/head';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { productService } from '@services/product.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListProduct } from '@components/product/table-list-product';
import { BreadcrumbComponent } from '@components/common';
import { showError } from '@lib/message';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';

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

function Products() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(productService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await productService.delete(id);
      message.success('Deleted successfully');
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Products' }]} />
      <Page>
        <SearchFilter
          statuses={statuses}
          onSubmit={handleFilter}
          searchWithPerformer
          performerId={`${router?.query?.performerId || ''}`}
        />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListProduct
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize)
            }}
            onChange={handleTableChange}
            deleteProduct={deleteProduct}
          />
        </div>
      </Page>
    </>
  );
}

export default Products;
