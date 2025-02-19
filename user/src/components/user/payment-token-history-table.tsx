/* eslint-disable react/destructuring-assignment */
import { formatDate } from '@lib/date';
import {
  Avatar, Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { ITransaction } from 'src/interfaces';

interface IProps {
  dataSource: ITransaction[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
}

function PaymentTableList({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange
}: IProps) {
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: 'id',
      render(data, record) {
        let url = '/auth/login';
        let as = '/';
        let query = {};
        switch (record.target) {
          case 'performer':
            url = '/[profileId]';
            as = `/${record?.performerInfo?.username || record?.performerInfo?._id}`;
            query = {
              profileId: record?.performerInfo?.username || record?.performerInfo?._id
            };
            break;
          case 'stream':
            url = '/[profileId]';
            as = `/${record?.performerInfo?.username || record?.performerInfo?._id}`;
            query = {
              profileId: record?.performerInfo?.username || record?.performerInfo?._id
            };
            break;
          case 'message':
            url = '/messages';
            as = `/messages?toId=${record?.performerId}&toSource=performer`;
            query = {
              toSource: 'performer',
              toId: record?.performerId
            };
            break;
          case 'feed':
            url = `/post?id=${record?.targetId}`;
            as = `/post/${record?.targetId}`;
            query = {
              id: record?.targetId
            };
            break;
          case 'product':
            url = '/product';
            as = `/product/${record?.targetId}`;
            query = {
              id: record?.targetId
            };
            break;
          case 'video':
            url = '/video';
            as = `/video/${record?.targetId}`;
            query = {
              id: record?.targetId
            };
            break;
          case 'gallery':
            url = '/gallery';
            as = `/gallery/${record?.targetId}`;
            query = {
              id: record?.targetId
            };
            break;
          default: null;
        }
        return (
          <Link
            href={{
              pathname: url,
              query
            }}
            as={as}
          >
            {record._id.slice(16, 24)}
          </Link>
        );
      }
    },
    {
      title: 'Creator',
      dataIndex: 'performerInfo',
      key: 'performer',
      render(data) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            <Avatar src={data?.avatar || '/no-avatar.jpg'} />
            {' '}
            {data?.name || data?.username || 'N/A'}
          </span>
        );
      }
    },
    {
      title: 'Description',
      key: 'description',
      render(data, record) {
        return record?.products.map((re) => (
          <Tooltip key={record._id} title={re.description}>
            <span style={{ whiteSpace: 'nowrap', maxWidth: 150, textOverflow: 'ellipsis' }}>
              {re.description}
            </span>
          </Tooltip>
        ));
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render(type: string) {
        switch (type) {
          case 'feed':
            return <Tag color="blue">Post</Tag>;
          case 'video':
            return <Tag color="pink">Video</Tag>;
          case 'product':
            return <Tag color="orange">Product</Tag>;
          case 'gallery':
            return <Tag color="violet">Gallery</Tag>;
          case 'message':
            return <Tag color="red">Message</Tag>;
          case 'tip':
            return <Tag color="red">Creator Tip</Tag>;
          case 'stream_tip':
            return <Tag color="red">Streaming Tip</Tag>;
          case 'public_chat':
            return <Tag color="pink">Streaming</Tag>;
          default: return <Tag color="default">{type}</Tag>;
        }
      }
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      key: 'tokens',
      render(totalPrice) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            $
            {(totalPrice || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render(status: string) {
        switch (status) {
          case 'pending':
            return <Tag color="blue">Pending</Tag>;
          case 'success':
            return <Tag color="green">Success</Tag>;
          case 'refunded':
            return <Tag color="red">Refunded</Tag>;
          default: return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
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
export default PaymentTableList;
