import { SearchFilter } from '@components/common';
import { PlusOutlined } from '@ant-design/icons';
import { galleryService } from '@services/gallery.service';
import {
  Button, Col, message, Row
} from 'antd';
import Link from 'next/link';
import { TableListGallery } from '@components/gallery/table-list';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';

const statuses = [
  {
    key: '',
    text: 'Status'
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

function PerformerGalleriesList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery?')) return;
    try {
      await galleryService.delete(id);
      message.success('Your gallery was deleted successfully');
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
  } = useClientFetch(buildUrl(galleryService.performerSearchUrl(), {
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
      <Row style={{ margin: '0 0 10px 0' }}>
        <Col lg={20} xs={24} style={{ padding: '0' }}>
          <SearchFilter
            statuses={statuses}
            searchWithKeyword
            onSubmit={handleFilter}
          />
        </Col>
        <Col
          lg={4}
          xs={24}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0'
          }}
        >
          <Link href="/creator/my-gallery/create">
            <Button className="secondary">
              <PlusOutlined />
              {' '}
              Create New
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="table-responsive">
        <TableListGallery
          dataSource={data?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: Number(current),
            pageSize: Number(pageSize),
            total: data?.total || 0
          }}
          onChange={handleTableChange}
          deleteGallery={handleDeleteGallery}
        />
      </div>
    </>
  );
}

export default PerformerGalleriesList;
