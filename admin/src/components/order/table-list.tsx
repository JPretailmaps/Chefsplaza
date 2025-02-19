import { Table, Tag, Avatar } from 'antd';
import {
  EyeOutlined
} from '@ant-design/icons';
import { IOrder } from 'src/interfaces';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

interface IProps {
  dataSource: IOrder[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
}

function OrderTableList({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange
}: IProps) {
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render(orderNumber, record) {
        return <Link href={{ pathname: '/order/[id]', query: { id: record._id } }} as={`/order/${record._id}`}>{orderNumber}</Link>;
      }
    },
    {
      title: 'User',
      dataIndex: 'userInfo',
      key: 'userInfo',
      render(userInfo) {
        return (
          <>
            <Avatar src={userInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {`${userInfo?.name || userInfo?.username || 'N/A'}`}
          </>
        );
      }
    },
    {
      title: 'Creator',
      dataIndex: 'performerInfo',
      key: 'performerInfo',
      render(performerInfo) {
        return (
          <>
            <Avatar src={performerInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {`${performerInfo?.name || performerInfo?.username || 'N/A'}`}
          </>
        );
      }
    },
    {
      title: 'Product',
      dataIndex: 'productInfo',
      key: 'productInfo',
      render(productInfo) {
        return productInfo?.name || 'N/A';
      }
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      render(totalPrice) {
        return (
          <>
            $
            {(totalPrice || 0).toFixed(2)}
          </>
        );
      }
    },
    {
      title: 'Product type',
      render(order: IOrder) {
        switch (order?.productInfo?.type) {
          case 'physical':
            return <Tag color="#00dcff">Physical</Tag>;
          case 'digital':
            return <Tag color="#FFCF00">Digital</Tag>;
          default:
            return <Tag color="default">Unknown</Tag>;
        }
      }
    },
    {
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      render(status: string) {
        switch (status) {
          case 'created':
            return <Tag color="gray">Created</Tag>;
          case 'processing':
            return <Tag color="#FFCF00">Processing</Tag>;
          case 'shipping':
            return <Tag color="#00dcff">Shipped</Tag>;
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
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render(id: string) {
        return <Link href={{ pathname: '/order/[id]', query: { id } }} as={`/order/${id}`}><EyeOutlined /></Link>;
      }
    }
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={{
        ...pagination, showSizeChanger: false, position: ['bottomCenter'], simple: isMobile
      }}
      rowKey={rowKey}
      loading={loading}
      onChange={onChange.bind(this)}
    />
  );
}
export default OrderTableList;
