import { SearchFilter } from '@components/common/search-filter';
import { TableListProduct } from '@components/product/table-list-product';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';
import { productService } from '@services/product.service';
import {
  Button, Col, message, Row
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

function PerformerProductsList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await productService.delete(id);
      message.success('Post deleted successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(productService.performerSearchUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  return (
    <>
      <div>
        <Row style={{ margin: '0 0 10px 0' }}>
          <Col lg={20} xs={24} style={{ padding: '0' }}>
            <SearchFilter
              statuses={statuses}
              onSubmit={handleFilter}
              searchWithKeyword
            />
          </Col>
          <Col
            lg={4}
            xs={24}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0'
            }}
          >
            <Button className="secondary">
              <Link href="/creator/my-store/create">
                New Product
              </Link>
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <TableListProduct
          dataSource={data?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            total: data?.total || 0,
            pageSize: Number(pageSize),
            current: Number(current)
          }}
          onChange={handleTableChange}
          deleteProduct={deleteProduct}
        />
      </div>
    </>
  );
}

export default PerformerProductsList;
