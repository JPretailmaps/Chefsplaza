import { formatDate } from '@lib/date';
import {
  Avatar,
  Button, Table, Tooltip
} from 'antd';
import { isMobile } from 'react-device-detect';

interface IProps {
  items: any[];
  searching: boolean;
  total: number;
  pageSize: number;
  onPaginationChange: Function;
  unblockUser: Function;
  submiting: boolean;
}

function UsersBlockList({
  items,
  searching,
  total,
  pageSize,
  onPaginationChange,
  unblockUser,
  submiting
}: IProps) {
  const columns = [
    {
      title: 'User',
      dataIndex: 'targetInfo',
      key: 'targetInfo',
      render: (targetInfo: any) => (
        <span>
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <Avatar src={targetInfo?.avatar || '/no-avatar.jpg'} size={28} />
          {' '}
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {targetInfo?.name || targetInfo?.username || 'N/A'}
        </span>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: any) => (
        <Tooltip title={reason}>
          <div style={{
            maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}
          >
            {reason}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => <span>{formatDate(createdAt)}</span>,
      sorter: true
    },
    {
      title: 'Action',
      key: '_id',
      render: (item) => (
        <Button
          className="unblock-user"
          type="primary"
          disabled={submiting}
          onClick={() => unblockUser(item.targetId)}
        >
          Unblock
        </Button>
      )
    }
  ];
  const dataSource = items.map((p) => ({ ...p, key: p._id }));

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      className="table"
      pagination={{
        total, pageSize, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
      }}
      loading={searching}
      onChange={onPaginationChange.bind(this)}
    />
  );
}
UsersBlockList.defaultProps = {};
export default UsersBlockList;
