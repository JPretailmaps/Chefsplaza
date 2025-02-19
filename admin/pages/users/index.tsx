import {
  Table, Tag, Avatar
} from 'antd';
import Page from '@components/common/layout/page';
import {
  EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import { formatDate } from '@lib/date';
import { BreadcrumbComponent, DropdownAction } from '@components/common';
import { userService } from '@services/user.service';
import { SearchFilter } from '@components/user/search-filter';
import Head from 'next/head';
import Link from 'next/link';
import { useClientFetch } from '@lib/request';
import { showError } from '@lib/message';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { buildUrl } from '@lib/string';

interface IProps {
  status: string;
  verifiedEmail: string;
}

function Users({ status, verifiedEmail }: IProps) {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(userService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure to delete ${user?.name || user?.username || 'this user'}`)) return;
    try {
      await userService.delete(user._id);
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  if (error) {
    showError(error);
  }

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (avatar) => <Avatar src={avatar || '/no-avatar.jpg'} />
    },
    {
      title: 'Display Name',
      dataIndex: 'name'
    },
    {
      title: 'Username',
      dataIndex: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(stt) {
        switch (stt) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'inactive':
            return <Tag color="red">Suspend</Tag>;
          case 'pending-email-confirmation':
            return <Tag color="default">Not verified email</Tag>;
          default: return <Tag color="default">{stt}</Tag>;
        }
      }
    },
    {
      title: 'Verified Email?',
      dataIndex: 'verifiedEmail',
      render(val) {
        switch (val) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="default">{val}</Tag>;
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
      render(id: string, record) {
        return (
          <DropdownAction
            menuOptions={[
              {
                key: 'update',
                name: 'Update',
                children: (
                  <Link
                    href={{
                      pathname: '/users/update/[id]',
                      query: { id }
                    }}
                    as={`/users/update/${id}`}
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
                  <a aria-hidden onClick={() => handleDelete(record)}>
                    <DeleteOutlined />
                    {' '}
                    Delete
                  </a>
                )
              }
            ]}
          />
        );
      }
    }
  ];

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Users' }]} />
      <Page>
        <SearchFilter
          onSubmit={handleFilter}
          defaultStatus={status}
          defaultEmailStatus={verifiedEmail}
        />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <Table
            dataSource={data?.data || []}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize),
              position: ['bottomCenter'],
              simple: isMobile
            }}
            onChange={handleTableChange.bind(this)}
          />
        </div>
      </Page>
    </>
  );
}

Users.getInitialProps = (ctx) => ctx.query;

export default Users;
