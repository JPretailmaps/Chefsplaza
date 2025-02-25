import {
  Table, Tag
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ImageProduct } from '@components/product/image-product';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteProduct: Function;
}

export function TableListProduct({
  dataSource, rowKey, loading, pagination, onChange, deleteProduct
}: IProps) {
  const columns = [
    {
      title: '',
      dataIndex: 'image',
      render(data, record) {
        return <ImageProduct product={record} />;
      }
    },
    {
      title: 'Creator',
      dataIndex: 'performer',
      render(data) {
        return <span>{data?.name || data?.username || 'N/A'}</span>;
      }
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render(price: number) {
        return (
          <span>
            $
            {(price || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      render(stock: number, record) {
        return <span>{record.type !== 'digital' ? stock : ''}</span>;
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render(type: string) {
        switch (type) {
          case 'physical':
            return <Tag color="blue">Physical</Tag>;
          case 'digital':
            return <Tag color="pink">Digital</Tag>;
          default: return <Tag color="default">{type}</Tag>;
        }
      }
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
      render: (id: string) => (
        <DropdownAction
          menuOptions={[
            {
              key: 'update',
              name: 'Update',
              children: (
                <Link
                  href={{
                    pathname: '/product/update/[id]',
                    query: { id }
                  }}
                  as={`/product/update/${id}`}
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
              onClick: () => deleteProduct && deleteProduct(id)
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
      pagination={pagination}
      onChange={onChange.bind(this)}
    />
  );
}
