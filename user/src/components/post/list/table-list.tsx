/* eslint-disable react/destructuring-assignment */
import {
  AudioOutlined, DeleteOutlined, EditOutlined,
  FileImageOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import {
  Button,
  Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { IFeed } from 'src/interfaces';
import { formatDate } from 'src/lib';

interface IProps {
  feeds: IFeed[];
  searching: boolean;
  total: number;
  pageSize: number;
  current: number;
  onChange: Function;
  onDelete: Function;
}

function FeedList({
  feeds,
  searching,
  total,
  pageSize,
  current,
  onChange,
  onDelete
}: IProps) {
  const columns = [
    {
      title: 'Post Type',
      key: 'id',
      render: (record) => {
        const images = record.files && record.files.filter((f) => f.type === 'feed-photo');
        return (
          <Link
            href={{
              pathname: '/post',
              query: {
                id: record.slug || record._id
              }
            }}
            as={`/post/${record.slug || record._id}`}
          >
            {record.type === 'photo' && (
            <span>
              {images?.length || 1}
              {' '}
              <FileImageOutlined />
              {' '}
            </span>
            )}
            {record.type === 'video' && (
            <span>
              <VideoCameraOutlined />
            </span>
            )}
            {record.type === 'audio' && (
            <span>
              <AudioOutlined />
            </span>
            )}
            {record.type === 'text' && (
            <span>
              Aa
            </span>
            )}
            {record.type === 'scheduled-streaming' && (
              <span>
                Live
              </span>
            )}
          </Link>
        );
      }
    },
    {
      title: 'Description',
      dataIndex: 'text',
      key: 'text',
      render: (text: string) => (
        <Tooltip title={text}>
          <div style={{
            width: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
          }}
          >
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'inactive':
            return <Tag color="orange">Inactive</Tag>;
          default: return <Tag color="blue">{status}</Tag>;
        }
      }
    },
    {
      title: 'Updated On',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (updatedAt: Date) => <span>{formatDate(updatedAt)}</span>,
      sorter: true
    },
    {
      title: 'Action',
      key: 'details',
      render: (record) => [
        <Button className="info" key="edit">
          <Link
            key="edit"
            href={{ pathname: '/creator/my-post/edit/[id]', query: { id: record._id } }}
            as={`/creator/my-post/edit/${record._id}`}
          >
            <EditOutlined />
          </Link>
        </Button>,
        <Button
          key="status"
          className="danger"
          onClick={() => onDelete(record)}
        >
          <DeleteOutlined />
        </Button>
      ]
    }
  ];
  const dataSource = feeds.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total,
        pageSize,
        current,
        position: ['bottomCenter'],
        showSizeChanger: false,
        simple: isMobile
      }}
      rowKey="_id"
      showSorterTooltip={false}
      loading={searching}
      onChange={onChange.bind(this)}
    />
  );
}
FeedList.defaultProps = {};
export default FeedList;
