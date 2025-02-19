/* eslint-disable react/destructuring-assignment */
import { EyeOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import {
  PaginationProps, Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { IOrder, IUser } from 'src/interfaces';

interface IProps {
  dataSource: IOrder[];
  pagination: PaginationProps;
  rowKey: string;
  loading: boolean;
  onChange: Function;
  user: IUser;
}

function OrderTableList({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange,
  user
}: IProps) {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render(orderNumber, record: IOrder) {
        return (
          <Link
            href={{ pathname: user.isPerformer ? '/creator/my-order/[id]' : '/user/orders/[id]', query: { id: record._id } }}
            as={user.isPerformer ? `/creator/my-order/${record._id}` : `/user/orders/${record._id}`}
          >
            {orderNumber || 'N/A'}
          </Link>
        );
      }
    },
    {
      title: 'Product',
      dataIndex: 'productInfo',
      key: 'productInfo',
      render(product) {
        return (
          <Tooltip title={product?.name || 'N/A'}>
            <div style={{
              maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}
            >
              <Link href={{ pathname: '/product', query: { id: product?.slug || product?._id } }} as={`/product/${product?.slug || product?._id}`}>
                {product?.name || 'N/A'}
              </Link>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      render(totalPrice) {
        return (
          <span>
            $
            {(totalPrice || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Delivery status',
      dataIndex: 'deliveryStatus',
      render(status: string) {
        switch (status) {
          case 'created':
            return <Tag color="gray">Created</Tag>;
          case 'processing':
            return <Tag color="#FFCF00">Processing</Tag>;
          case 'shipping':
            return <Tag color="#00dcff">Shipping</Tag>;
          case 'delivered':
            return <Tag color="#00c12c">Delivered</Tag>;
          case 'refunded':
            return <Tag color="red">Refunded</Tag>;
          default: return <Tag color="#FFCF00">{status}</Tag>;
        }
      }
    },
    {
      title: 'Updated On',
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Action',
      render(record: IOrder) {
        return (
          <Link
            href={{ pathname: user.isPerformer ? '/creator/my-order/[id]' : '/user/orders/[id]', query: { id: record._id } }}
            as={user.isPerformer ? `/creator/my-order/${record._id}` : `/user/orders/${record._id}`}
          >
            <EyeOutlined />
            {' '}
            view
          </Link>
        );
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}

export default OrderTableList;
