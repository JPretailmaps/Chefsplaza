import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { CoverGallery } from '@components/gallery/cover-gallery';
import { formatDate } from '@lib/date';
import {
  Button, PaginationProps, Table, Tag
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: PaginationProps;
  onChange: Function;
  deleteGallery: Function;
}

export function TableListGallery(props: IProps) {
  const {
    dataSource,
    rowKey,
    loading,
    pagination,
    onChange,
    deleteGallery
  } = props;
  const columns = [
    {
      title: 'Thumbnail',
      render(data, record) {
        return (
          <Link
            href={{
              pathname: '/gallery/[id]',
              query: { id: record._id }
            }}
          >
            <CoverGallery gallery={record} />
          </Link>
        );
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render(title, record) {
        return (
          <div style={{
            maxWidth: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
          }}
          >
            <Link
              href={{
                pathname: `/gallery/${record?.slug || record?._id}`,
                query: { id: record._id }
              }}
              as={`/gallery/${record?.slug || record?._id}`}
            >
              {title}
            </Link>
          </div>
        );
      }
    },
    {
      title: 'PPV',
      dataIndex: 'isSale',
      render(isSale: boolean) {
        switch (isSale) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="#FFCF00">N</Tag>;
          default: return <Tag color="#FFCF00">{isSale}</Tag>;
        }
      }
    },
    {
      title: 'Total photos',
      dataIndex: 'numOfItems'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'inactive':
            return <Tag color="orange">Inactive</Tag>;
          default: return <Tag color="#FFCF00">{status}</Tag>;
        }
      }
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (data, record) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Button className="info">
            <Link
              href={{
                pathname: '/creator/my-gallery/update/[id]',
                query: { id: record._id }
              }}
              as={`/creator/my-gallery/update/${record._id}`}
            >
              <EditOutlined />
            </Link>
          </Button>
          <Button
            onClick={() => deleteGallery && deleteGallery(record._id)}
            className="danger"
          >
            <DeleteOutlined />
          </Button>
        </div>
      )
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
