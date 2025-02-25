import {
  Table, Tag, Avatar, Tooltip
} from 'antd';
import { IPaymentTokenHistory } from 'src/interfaces';
import { formatDate } from '@lib/date';

interface IProps {
  dataSource: IPaymentTokenHistory[];
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
        // let path = '';
        // switch (record.target) {
        //   case 'feed':
        //     path = `/post/${record?.targetId}`;
        //     break;
        //   case 'product':
        //     path = `/store/${record?.targetId}`;
        //     break;
        //   case 'video':
        //     path = `/video/${record?.targetId}`;
        //     break;
        //   case 'gallery':
        //     path = `/gallery/${record?.targetId}`;
        //     break;
        //   case 'performer':
        //     path = `/${record?.targetId}`;
        //     break;
        //   case 'stream':
        //     path = `/${record?.performerId}`;
        //     break;
        //   default: path = '/home';
        // }
        return (
          <a
            style={{ textTransform: 'uppercase', fontWeight: 600 }}
          >
            {record._id.slice(16, 24)}
          </a>
        );
      }
    },
    {
      title: 'User',
      dataIndex: 'sourceInfo',
      key: 'user',
      render(sourceInfo) {
        return (
          <span>
            <Avatar src={sourceInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {sourceInfo?.name || sourceInfo?.username || 'N/A'}
          </span>
        );
      }
    },
    {
      title: 'Creator',
      dataIndex: 'performerInfo',
      key: 'performerInfo',
      render(data, record) {
        return (
          <span>
            <Avatar src={record?.performerInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {record?.performerInfo?.name || record?.performerInfo?.username || 'N/A'}
          </span>
        );
      }
    },
    {
      title: 'Description',
      render(data, record) {
        return record.products.map((re) => (
          <Tooltip key={record._id} title={re.description}>
            <span key={record._id} style={{ maxWidth: 150, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {re.description}
            </span>
          </Tooltip>
        ));
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render(type: string) {
        switch (type) {
          case 'feed':
            return <Tag color="#1da3f1">Feed</Tag>;
          case 'video':
            return <Tag color="#00dcff">Video</Tag>;
          case 'gallery':
            return <Tag color="#00dcff">Gallery</Tag>;
          case 'product':
            return <Tag color="#FFCF00">Product</Tag>;
          case 'tip':
            return <Tag color="#dc3545">Creator Tip</Tag>;
          case 'gift':
            return <Tag color="#dc2244">Gift</Tag>;
          case 'message':
            return <Tag color="#46b545">Message</Tag>;
          case 'public_chat':
            return <Tag color="#46c5ae">Streaming</Tag>;
          case 'group_chat':
            return <Tag color="#3f9c8b">Group Chat</Tag>;
          case 'private_chat':
            return <Tag color="#157160">Private Chat</Tag>;
          case 'stream_tip':
            return <Tag color="#157160">Streaming Tip</Tag>;
          default: return <Tag color="default">{type}</Tag>;
        }
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
      title: 'Updated On',
      dataIndex: 'updatedAt',
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
        pagination={pagination}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
export default PaymentTableList;
