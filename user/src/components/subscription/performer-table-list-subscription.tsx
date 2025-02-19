import { formatDate, nowIsBefore } from '@lib/date';
import { Avatar, Table, Tag } from 'antd';
import Link from 'next/link';
import { ISubscription } from 'src/interfaces';
import {
  MessageOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

interface IProps {
  dataSource: ISubscription[];
  pagination: any;
  rowKey: string;
  onChange: Function;
  loading: boolean;
}

export function PerformerTableListSubscription({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading
}: IProps) {
  const columns = [
    {
      title: 'User',
      dataIndex: 'userInfo',
      render(data, record) {
        return (
          <Link href={{ pathname: '/messages', query: { toId: record?.userInfo?._id, toSource: 'user' } }}>
            <Avatar src={record?.userInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {record?.userInfo?.name || record?.userInfo?.username || 'N/A'}
          </Link>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return <Tag color="blue">Monthly</Tag>;
          case 'yearly':
            return <Tag color="red">Yearly</Tag>;
          case 'free':
            return <Tag color="orange">Free</Tag>;
          case 'system':
            return <Tag color="default">System</Tag>;
          default:
            return <Tag color="orange">{subscriptionType}</Tag>;
        }
      }
    },
    {
      title: 'Start Date',
      dataIndex: 'createdAt',
      render(date: Date) {
        return <span>{formatDate(date, 'll')}</span>;
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      render(date: Date, record: ISubscription) {
        return <span>{record.status !== 'active' || !nowIsBefore(record.expiredAt) ? formatDate(date, 'll') : ''}</span>;
      }
    },
    {
      title: 'Renewal Date',
      dataIndex: 'nextRecurringDate',
      render(date: Date, record: ISubscription) {
        return <span>{record.status === 'active' && record.subscriptionType !== 'free' && formatDate(date, 'll')}</span>;
      }
    },
    {
      title: 'PM Gateway',
      dataIndex: 'paymentGateway',
      render(paymentGateway: string) {
        switch (paymentGateway) {
          case 'stripe':
            return <Tag color="blue">Stripe</Tag>;
          case 'paypal':
            return <Tag color="violet">Paypal</Tag>;
          case 'ccbill':
            return <Tag color="orange">CCbill</Tag>;
          default:
            return <Tag color="cyan">{paymentGateway}</Tag>;
        }
      }
    },
    {
      title: 'Updated on',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string, record: ISubscription) {
        if (record.status === 'active' && !nowIsBefore(record.expiredAt)) {
          return <Tag color="red">Suspended</Tag>;
        }
        switch (status) {
          case 'active':
            return <Tag color="#00c12c">Active</Tag>;
          case 'deactivated':
            return <Tag color="#FFCF00">Inactive</Tag>;
          default:
            return <Tag color="pink">{status}</Tag>;
        }
      }
    },
    {
      title: 'Message',
      render(record: ISubscription) {
        return (
          <Link href={{ pathname: '/messages', query: { toId: record?.userInfo?._id, toSource: 'user' } }}>
            <MessageOutlined />
          </Link>
        );
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        onChange={onChange.bind(this)}
        loading={loading}
      />
    </div>
  );
}
