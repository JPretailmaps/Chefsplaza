import { Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { DropdownAction } from '@components/common/dropdown-action';
import { isMobile } from 'react-device-detect';
import getConfig from 'next/config';

const { publicRuntimeConfig: { SITE_URL } } = getConfig();

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteMenu: Function;
}

export function TableListMenu({
  dataSource, rowKey, loading, pagination, onChange, deleteMenu
}: IProps) {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      render(title: string, record: any) {
        return (
          <a href={`${SITE_URL}${record.path}`} target="_blank" rel="noreferrer">
            {title}
          </a>
        );
      }
    },
    {
      title: 'Path',
      dataIndex: 'path',
      render(path: string) {
        return (
          <a href={`${SITE_URL}${path}`} target="_blank" rel="noreferrer">
            {path}
          </a>
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
      render: (data, record) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/menu/update/[id]',
                    query: { id: record._id }
                  }}
                  as={`/menu/update/${record._id}`}
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
              onClick: () => deleteMenu && deleteMenu(record._id)
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
      pagination={{ ...pagination, simple: isMobile }}
      onChange={onChange.bind(this)}
    />
  );
}
