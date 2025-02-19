import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import {
  Button, PaginationProps, Table, Tag, Tooltip
} from 'antd';
import Link from 'next/link';

import { isMobile } from 'react-device-detect';
import { ThumbnailVideo } from './thumbnail-video';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: PaginationProps;
  onChange: Function;
  onDelete: Function;
}

export function TableListVideo(props: IProps) {
  const {
    dataSource,
    rowKey,
    loading,
    pagination,
    onChange,
    onDelete
  } = props;
  const columns = [
    {
      title: 'Thumbnail',
      render(record: any) {
        return (
          <Link href={{ pathname: '/video/[id]', query: { id: record.slug || record._id } }}><ThumbnailVideo video={record} /></Link>
        );
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      render(title: string, record: any) {
        return (
          <Tooltip title={title}>
            <div style={{
              maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}
            >
              <Link href={{ pathname: '/video/[id]', query: { id: record.slug || record._id } }}>
                {title}
              </Link>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: 'Sale?',
      dataIndex: 'isSale',
      render(isSale: boolean) {
        switch (isSale) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="orange">{isSale}</Tag>;
        }
      }
    },
    {
      title: 'Schedule?',
      dataIndex: 'isSchedule',
      render(isSchedule: boolean) {
        switch (isSchedule) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="orange">{isSchedule}</Tag>;
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'active':
            return <Tag color="success">Active</Tag>;
          case 'inactive':
            return <Tag color="orange">Inactive</Tag>;
          default:
            return <Tag color="red">{status}</Tag>;
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
      render: (id: string) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Button className="info">
            <Link
              href={{
                pathname: '/creator/my-video/update/[id]',
                query: { id }
              }}
              as={`/creator/my-video/update/${id}`}
            >
              <EditOutlined />
            </Link>
          </Button>
          <Button onClick={() => onDelete(id)} className="danger">
            <DeleteOutlined />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="table-responsive">
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
        }}
        onChange={onChange.bind(this)}
      />
    </div>
  );
}
