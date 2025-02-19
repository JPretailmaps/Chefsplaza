import {
  PaginationProps, Table, Tag, Avatar
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ThumbnailPhoto } from '@components/photo/thumbnail-photo';
import { DropdownAction } from '@components/common/dropdown-action';
import { IPerformer } from 'src/interfaces';
import { isMobile } from 'react-device-detect';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: PaginationProps;
  onChange: Function;
  deletePhoto: Function;
}

export function TableListPhoto({
  dataSource, rowKey, loading, pagination, onChange, deletePhoto
}: IProps) {
  const columns = [
    {
      title: 'Thumb',
      render(data) {
        return <ThumbnailPhoto photo={data} />;
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true
    },
    {
      title: 'Creator',
      dataIndex: 'performer',
      render(performer: IPerformer) {
        return (
          <>
            <Avatar
              size={40}
              src={performer?.avatar || '/no-avatar.jpg'}
              alt="avatar"
              style={{ borderRadius: '50%' }}
            />
            {' '}
            {performer?.name || performer?.username || 'N/A'}
          </>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
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
      render: (id: string) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/photos/update/[id]',
                    query: { id }
                  }}
                  as={`/photos/update/${id}`}
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
              onClick: () => deletePhoto(id)
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
