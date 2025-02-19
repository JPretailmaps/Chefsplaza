import {
  Table, Tag, Dropdown, Menu, Button
} from 'antd';
import {
  DeleteOutlined, EditOutlined, DownOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import getConfig from 'next/config';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deletePost: Function;
}

export function TableListPost(props: IProps) {
  const { deletePost } = props;
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render(data, record) {
        return (
          <Link
            href={{
              pathname: '/posts/update/[id]',
              query: {
                id: record._id
              }
            }}
            as={`/posts/update/${record._id}`}
          >
            {record.title}
          </Link>
        );
      }
    },
    {
      title: 'Link',
      dataIndex: 'link',
      render(data, record) {
        const { publicRuntimeConfig: config } = getConfig();
        return (
          <a href={`${config.SITE_URL}/page/${record.slug}`} target="_blank" rel="noreferrer">
            {`${config.SITE_URL}/page/${record.slug}`}
          </a>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        return (
          <Tag color={status === 'published' ? 'green' : 'default'} key={status}>
            {status === 'published' ? 'Active' : 'Inactive'}
          </Tag>
        );
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
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="edit">
                <Link
                  href={{
                    pathname: '/posts/update/[id]',
                    query: { id }
                  }}
                  as={`/posts/update/${id}`}
                >
                  <EditOutlined />
                  {' '}
                  Update
                </Link>
              </Menu.Item>
              <Menu.Item key="delete" onClick={() => deletePost && deletePost(id)}>
                <a>
                  <DeleteOutlined />
                  {' '}
                  Delete
                </a>
              </Menu.Item>
            </Menu>
            )}
        >
          <Button>
            Actions
            {' '}
            <DownOutlined />
          </Button>
        </Dropdown>
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
      pagination={pagination}
      onChange={onChange.bind(this)}
    />
  );
}
