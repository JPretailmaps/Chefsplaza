import { PureComponent } from 'react';
import { Table, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '@lib/date';
import Link from 'next/link';
import { ThumbnailVideo } from '@components/video/thumbnail-video';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  dataSource: any;
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
  deleteVideo: Function;
}

export class TableListVideo extends PureComponent<IProps> {
  render() {
    const {
      dataSource, rowKey, loading, pagination, onChange, deleteVideo
    } = this.props;

    const columns = [
      {
        title: 'Thumbnail',
        dataIndex: 'thumbnail',
        render(data, record) {
          return (
            <Link
              href={{
                pathname: '/video/update/[id]',
                query: { id: record._id }
              }}
              as={`/video/update/${record._id}`}
            >
              <ThumbnailVideo video={record} />
            </Link>
          );
        }
      },
      {
        title: 'Creator',
        dataIndex: 'performer',
        render(data, record) {
          return <span>{record?.performer?.name || record?.performer?.username || 'N/A'}</span>;
        }
      },
      {
        title: 'Title',
        dataIndex: 'title',
        render(title) {
          return (
            <Tooltip title={title}>
              <div style={{
                maxWidth: 150, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
              }}
              >
                {title}
              </div>
            </Tooltip>
          );
        }
      },
      {
        title: 'For sale?',
        dataIndex: 'isSale',
        render(isSale: boolean) {
          switch (isSale) {
            case true:
              return <Tag color="green">Y</Tag>;
            case false:
              return <Tag color="red">N</Tag>;
            default: return <Tag color="default">{isSale}</Tag>;
          }
        }
      },
      {
        title: 'Scheduled?',
        dataIndex: 'isSchedule',
        render(isSchedule: boolean) {
          switch (isSchedule) {
            case true:
              return <Tag color="green">Y</Tag>;
            case false:
              return <Tag color="red">N</Tag>;
            default: return <Tag color="default">{isSchedule}</Tag>;
          }
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render(status: string) {
          switch (status) {
            case 'active':
              return <Tag color="green">Active</Tag>;
            case 'inactive':
              return <Tag color="red">Inactive</Tag>;
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
      },
      {
        title: 'Action',
        dataIndex: '_id',
        render: (id: string) => (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/video/update/[id]',
                      query: { id }
                    }}
                    as={`/video/update/${id}`}
                  >
                    <EditOutlined />
                    {' '}
                    Update
                  </Link>
                )
              },
              {
                key: 'delete',
                name: 'Delete',
                children: (
                  <a>
                    <DeleteOutlined />
                    {' '}
                    Delete
                  </a>
                ),
                onClick: () => deleteVideo(id)
              }
            ]}
          />
        )
      }
    ];
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
}
