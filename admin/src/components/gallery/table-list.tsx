import { Table, Tag, Avatar } from 'antd';
import {
  DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { CoverGallery } from '@components/gallery/cover-gallery';
import { DropdownAction } from '@components/common/dropdown-action';
import { isMobile } from 'react-device-detect';
import { IGallery } from 'src/interfaces';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteGallery: Function;
}

export function TableListGallery({
  dataSource, rowKey, loading, pagination, onChange, deleteGallery
}: IProps) {
  const columns = [
    {
      title: 'Thumbnail',
      render(data, record) {
        return (
          <Link
            href={{
              pathname: '/gallery/update/[id]',
              query: { id: record._id }
            }}
            as={`/gallery/update/${record._id}`}
          >
            <CoverGallery gallery={record} />
          </Link>
        );
      }
    },
    {
      title: 'Creator',
      dataIndex: 'performer',
      render(data, record: IGallery) {
        return (
          <>
            <Avatar src={record?.performer?.avatar || '/no-avatar.jpg'} />
            &nbsp;
            {record?.performer?.name || record?.performer?.username || 'N/A'}
          </>
        );
      }
    },
    {
      title: 'Title',
      dataIndex: 'title'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render(price: number) {
        return (
          <span>
            $
            {price.toFixed(2)}
          </span>
        );
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
            return <Tag color="red">Inactive</Tag>;
          default: return <Tag color="default">{status}</Tag>;
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
        <DropdownAction
          menuOptions={[
            {
              key: 'view-photo',
              name: 'View photo',
              children: (
                <Link
                  href={{
                    pathname: '/photos',
                    query: {
                      galleryId: record._id,
                      performerId: record.performerId
                    }
                  }}
                  as={`/photos?galleryId=${record._id}`}
                >
                  <EyeOutlined />
                  {' '}
                  View photos
                </Link>
              )
            },
            {
              key: 'add-more-photo',
              name: 'Add Photos',
              children: (
                <Link
                  href={{
                    pathname: '/photos/bulk-upload',
                    query: {
                      galleryId: record._id,
                      performerId: record.performerId
                    }
                  }}
                  as={`/photos/bulk-upload?galleryId=${record._id}&performerId=${record.performerId}`}
                >
                  <PlusOutlined />
                  {' '}
                  Add Photos
                </Link>
              )
            },
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/gallery/update/[id]',
                    query: { id: record._id }
                  }}
                  as={`/gallery/update/${record._id}`}
                >
                  <EditOutlined />
                  {' '}
                  Update
                </Link>
              )
            },
            {
              key: 'delete',
              name: 'Delete',
              children: (
                <a>
                  <DeleteOutlined />
                  {' '}
                  Delete
                </a>
              ),
              onClick: () => deleteGallery && deleteGallery(record._id)
            }
          ]}
        />
      )
    }
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={rowKey}
      loading={loading}
      pagination={{ ...pagination, position: ['bottomCenter'], simple: isMobile }}
      onChange={onChange.bind(this)}
    />
  );
}
