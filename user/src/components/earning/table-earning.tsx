/* eslint-disable default-case */
import { formatDate } from '@lib/date';
import { Table, Tag, Avatar } from 'antd';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import { IEarning } from 'src/interfaces';

interface IProps {
  dataSource: IEarning[];
  rowKey: string;
  pagination: any;
  onChange: Function;
  loading: boolean;
}

export function TableListEarning(props: IProps) {
  const {
    dataSource, rowKey, pagination, onChange, loading
  } = props;
  const columns = [
    {
      title: 'User',
      dataIndex: 'userInfo',
      render(userInfo) {
        return (
          <Link href={{ pathname: '/messages', query: { toSource: 'user', toId: userInfo?._id } }}>
            <Avatar src={userInfo?.avatar || '/no-avatar.jpg'} />
            &nbsp;
            {userInfo?.name || userInfo?.username || 'N/A'}
          </Link>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render(type: string) {
        switch (type) {
          case 'monthly_subscription':
            return <Tag color="red">Monthly subs</Tag>;
          case 'yearly_subscription':
            return <Tag color="red">Yearly subs</Tag>;
          case 'public_chat':
            return <Tag color="violet">Streaming</Tag>;
          case 'feed':
            return <Tag color="green">Post</Tag>;
          case 'tip':
            return <Tag color="orange">Tip</Tag>;
          case 'message':
            return <Tag color="pink">Message</Tag>;
          case 'product':
            return <Tag color="blue">Product</Tag>;
          case 'gallery':
            return <Tag color="success">Gallery</Tag>;
          case 'stream_tip':
            return <Tag color="orange">Streaming tip</Tag>;
        }
        return <Tag color="success">{type}</Tag>;
      }
    },
    {
      title: 'GROSS',
      dataIndex: 'grossPrice',
      render(grossPrice: number) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            $
            {grossPrice.toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Commission',
      dataIndex: 'siteCommission',
      render(commission: number) {
        return (
          <span>
            {commission * 100}
            %
          </span>
        );
      }
    },
    {
      title: 'NET',
      dataIndex: 'netPrice',
      render(netPrice: number) {
        return (
          <span style={{ whiteSpace: 'nowrap' }}>
            $
            {(netPrice || 0).toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      sorter: true,
      render(createdAt: Date) {
        return <span>{formatDate(createdAt)}</span>;
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
