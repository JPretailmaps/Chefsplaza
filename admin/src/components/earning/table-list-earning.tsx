import {
  Table, Tag, Avatar
} from 'antd';
import { formatDate } from '@lib/date';
import { IEaring } from '@interfaces/earning';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
}

export function TableListEarning(props: IProps) {
  const columns = [
    {
      title: 'Creator',
      dataIndex: 'performerInfo',
      key: 'performer',
      render(data, record) {
        return (
          <div>
            <Avatar src={record?.performerInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {record?.performerInfo?.name || record?.performerInfo?.username || 'N/A'}
          </div>
        );
      }
    },
    {
      title: 'User',
      dataIndex: 'userInfo',
      key: 'user',
      render(data, record) {
        return (
          <div>
            <Avatar src={record?.userInfo?.avatar || '/no-avatar.jpg'} />
            {' '}
            {record?.userInfo?.name || record?.userInfo?.username || 'N/A'}
          </div>
        );
      }
    },
    {
      title: 'GROSS',
      dataIndex: 'grossPrice',
      render(grossPrice: number) {
        return `$${(grossPrice || 0).toFixed(2)}`;
      }
    },
    {
      title: 'Platform Commission %',
      dataIndex: 'siteCommission',
      render(commission) {
        return (
          <span>
            {(commission || 0) * 100}
            %
          </span>
        );
      }
    },
    {
      title: 'Platform Earning',
      render(earning: IEaring) {
        return `$${(earning.grossPrice - earning.netPrice).toFixed(2)}`;
      }
    },
    {
      title: 'Creator Earnings',
      dataIndex: 'netPrice',
      render(netPrice: number) {
        return `$${(netPrice || 0).toFixed(2)}`;
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render(type: string) {
        switch (type) {
          case 'product':
            return <Tag color="#FFCF00">Product</Tag>;
          case 'gallery':
            return <Tag color="#FFCF00">Gallery</Tag>;
          case 'feed':
            return <Tag color="green">Post</Tag>;
          case 'tip':
            return <Tag color="#00dcff">Tip</Tag>;
          case 'video':
            return <Tag color="blue">Video</Tag>;
          case 'stream_tip':
            return <Tag color="violet">Streaming Tip</Tag>;
          case 'public_chat':
            return <Tag color="pink">Streaming</Tag>;
          case 'monthly_subscription':
            return <Tag color="red">Monthly Sub</Tag>;
          case 'yearly_subscription':
            return <Tag color="red">Yearly Sub</Tag>;
          default: return <Tag color="#00dcff">{type}</Tag>;
        }
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      sorted: true,
      render(createdAt: Date) {
        return <span>{formatDate(createdAt)}</span>;
      }
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
