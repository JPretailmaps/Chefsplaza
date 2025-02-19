import { UploadOutlined } from '@ant-design/icons';
import { SearchFilter } from '@components/common/search-filter';
import { TableListVideo } from '@components/video/table-list';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';
import { videoService } from '@services/video.service';
import {
  Button, Col, Row
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

function PerformerVideosList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(videoService.performerSearchUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  const deleteVideo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    try {
      await videoService.delete(id);
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
      <div>
        <Row style={{ margin: '0 0 10px 0' }}>
          <Col md={16} xs={24} style={{ padding: '0' }}>
            <SearchFilter
              searchWithKeyword
              statuses={statuses}
              onSubmit={handleFilter}
            />
          </Col>
          <Col
            md={8}
            xs={24}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0'
            }}
          >
            <Button className="primary">
              <Link href="/creator/my-video/upload">
                <UploadOutlined />
                {' '}
                Upload new
              </Link>
            </Button>
            &nbsp;
            <Button className="secondary">
              <Link href="/creator/my-video/bulk-upload">
                <UploadOutlined />
                {' '}
                Bulk upload
              </Link>
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <TableListVideo
          dataSource={data?.data || []}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: Number(current),
            pageSize: Number(pageSize),
            total: data?.total || 0
          }}
          onChange={handleTableChange}
          onDelete={deleteVideo}
        />
      </div>
    </>
  );
}

export default PerformerVideosList;
