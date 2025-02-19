import { formatDate, nowIsBefore } from '@lib/date';
import {
  Avatar,
  Button, Table, Tag
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { ISubscription } from 'src/interfaces';

interface IProps {
  dataSource: ISubscription[];
  pagination: any;
  rowKey: string;
  onChange: any;
  loading: boolean;
  cancelSubscription: Function;
  activeSubscription: Function;
}

export function UserTableListSubscription({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading,
  cancelSubscription,
  activeSubscription
}: IProps) {
  const columns = [
    {
      title: 'Creator',
      dataIndex: 'performerInfo',
      render(data, records: ISubscription) {
        return (
          <Link
            href={{
              pathname: '/creator/profile',
              query: { username: records?.performerInfo?.username || records?.performerInfo?._id }
            }}
            as={`/${records?.performerInfo?.username || records?.performerInfo?._id}`}
          >
            <Avatar src={records?.performerInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {records?.performerInfo?.name || records?.performerInfo?.username || 'N/A'}
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
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date, 'll')}</span>;
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      sorter: true,
      render(date: Date, record: ISubscription) {
        return <span>{record.status !== 'active' || !nowIsBefore(record.expiredAt) ? formatDate(date, 'll') : ''}</span>;
      }
    },
    {
      title: 'Renewal Date',
      dataIndex: 'nextRecurringDate',
      sorter: true,
      render(date: Date, record: ISubscription) {
        return <span>{record.status === 'active' && record.subscriptionId && record.subscriptionType !== 'free' && formatDate(date, 'll')}</span>;
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
      title: 'PM Gateway',
      dataIndex: 'paymentGateway',
      render(paymentGateway: string) {
        switch (paymentGateway) {
          case 'stripe':
            return <Tag color="blue">Stripe</Tag>;
          case 'ccbill':
            return <Tag color="orange">CCbill</Tag>;
          default:
            return <Tag color="default">{paymentGateway}</Tag>;
        }
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
            return <Tag color="success">Active</Tag>;
          case 'deactivated':
            return <Tag color="red">Inactive</Tag>;
          default:
            return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render(_id, record: ISubscription) {
        return (
          <>
            {record.status === 'active' && nowIsBefore(record.expiredAt) && (
              <Button type="primary" danger onClick={() => cancelSubscription(record)}>
                Cancel
              </Button>
            )}
            {!nowIsBefore(record.expiredAt) && (
              <Button className="primary" onClick={() => activeSubscription(record)}>
                Activate
              </Button>
            )}
          </>
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
        onChange={onChange}
        loading={loading}
      />
    </div>
  );
}
