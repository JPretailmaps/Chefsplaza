import {
  Table, Tag, Button, Avatar
} from 'antd';
import { StopOutlined, RightCircleOutlined } from '@ant-design/icons';
import { ISubscription } from 'src/interfaces';
import { formatDate, nowIsBefore } from '@lib/date';

interface IProps {
  dataSource: ISubscription[];
  pagination: {};
  rowKey: string;
  onChange:any;
  loading: boolean;
  onCancelSubscription: Function;
  onRenewSubscription: Function;
}

export function TableListSubscription({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading,
  onCancelSubscription,
  onRenewSubscription
}: IProps) {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'subscriptionId'
    },
    {
      title: 'User',
      dataIndex: 'userInfo',
      render(data, records) {
        return (
          <span>
            <Avatar src={records?.userInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {`${records?.userInfo?.name || records?.userInfo?.username || 'N/A'}`}
          </span>
        );
      }
    },
    {
      title: 'Creator',
      dataIndex: 'performerInfo',
      render(data, records) {
        return (
          <span>
            <Avatar src={records?.performerInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {`${records?.performerInfo?.name || records?.performerInfo?.username || 'N/A'}`}
          </span>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'monthly':
            return <Tag color="orange">Monthly</Tag>;
          case 'yearly':
            return <Tag color="purple">Yearly</Tag>;
          case 'free':
            return <Tag color="red">Free</Tag>;
          default: return <Tag color="orange">{subscriptionType}</Tag>;
        }
      }
    },
    {
      title: 'Start Date',
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date, 'LL')}</span>;
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      sorter: true,
      render(date: Date, record: ISubscription) {
        return <span>{record.status !== 'active' || !nowIsBefore(record.expiredAt) ? formatDate(date, 'LL') : ''}</span>;
      }
    },
    {
      title: 'Renewal Date',
      dataIndex: 'nextRecurringDate',
      sorter: true,
      render(date: Date, record: ISubscription) {
        return <span>{record.status === 'active' && record.subscriptionId && record.subscriptionType !== 'free' && record.subscriptionId && formatDate(date, 'LL')}</span>;
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
            return <Tag color="green">Active</Tag>;
          case 'deactivated':
            return <Tag color="red">Inactive</Tag>;
          default: return <Tag color="red">Inactive</Tag>;
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
      dataIndex: 'status',
      render(data, records: ISubscription) {
        return (
          <>
            {records?.status === 'active' && nowIsBefore(records.expiredAt) && (
              <Button type="primary" onClick={() => onCancelSubscription(records)}>
                <StopOutlined />
                {' '}
                Cancel
              </Button>
            )}
            {!nowIsBefore(records.expiredAt) && (
            <Button type="primary" onClick={() => onRenewSubscription(records)}>
              <RightCircleOutlined />
              {' '}
              Activate
            </Button>
            )}
          </>
        );
      }
    }
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
}
