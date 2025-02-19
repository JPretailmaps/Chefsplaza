import {
  Avatar,
  PaginationProps,
  Table, Tag
} from 'antd';
import {
  EditOutlined, DeleteOutlined, FileImageOutlined, VideoCameraOutlined, AudioOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import { isMobile } from 'react-device-detect';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: PaginationProps;
  onChange: Function;
  deleteFeed: Function;
}
export function TableListFeed(props: IProps) {
  const { deleteFeed } = props;
  const columns = [
    {
      title: 'Creator',
      dataIndex: 'name',
      render(data, record) {
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
      title: 'Description',
      dataIndex: 'text',
      render(data, record) {
        return (
          <div style={{
            whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '300px'
          }}
          >
            {record.text}
          </div>
        );
      }

    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type, record) => {
        const images = record.files && record.files.filter((f) => f.type === 'feed-photo');
        return (
          <Link
            href={{
              pathname: '/feed/update/[id]',
              query: { id: record._id }
            }}
            as={`/feed/update/${record._id}`}
          >
            {type === 'photo' && (
              <span>
                {images?.length || 1}
                {' '}
                <FileImageOutlined />
                {' '}
              </span>
            )}
            {type === 'video' && (
              <span>
                <VideoCameraOutlined />
              </span>
            )}
            {type === 'audio' && (
              <span>
                <AudioOutlined />
              </span>
            )}
            {type === 'text' && (
              <span>
                Aa
              </span>
            )}
            {type === 'scheduled-streaming' && (
              <span>
                Live
              </span>
            )}
          </Link>
        );
      }
    },

    {
      title: 'PPV',
      dataIndex: 'isSale',
      render(data, record) {
        if (!record.isSale) {
          return <Tag color="red">N</Tag>;
        }
        return <Tag color="green">Y</Tag>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status) {
        if (status === 'inactive') {
          return <Tag color="red">Inactive</Tag>;
        }
        return <Tag color="green">Active</Tag>;
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
                    pathname: '/feed/update/[id]',
                    query: { id }
                  }}
                  as={`/feed/update/${id}`}
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
              onClick: () => deleteFeed(id)
            }
          ]}
        />
      )
    }
  ];
  const {
    dataSource, rowKey, loading, pagination, onChange
  } = props;
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={rowKey}
      loading={loading}
      pagination={{
        ...pagination,
        position: ['bottomCenter'],
        simple: isMobile
      }}
      onChange={onChange.bind(this)}
    />
  );
}
