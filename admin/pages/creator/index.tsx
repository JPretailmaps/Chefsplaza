import {
  DeleteOutlined,
  EditOutlined, FireOutlined,
  PictureOutlined,
  SkinOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { BreadcrumbComponent, DropdownAction } from '@components/common';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/performer/search-filter';
import { formatDate } from '@lib/date';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { performerService } from '@services/performer.service';
import {
  Avatar,
  Table,
  Tag
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { IPerformer } from 'src/interfaces';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Performers() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(performerService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const handleDelete = async (performer) => {
    if (!window.confirm(`Are you sure to delete ${performer?.name || performer?.username || 'this creator'}`)) return;
    try {
      await performerService.delete(performer._id);
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
      render: (avatar: string, record: IPerformer) => (
        <a href={`${publicRuntimeConfig.SITE_URL}/page/${record.username}`} target="_blank" rel="noreferrer">
          <Avatar src={avatar || '/no-avatar.jpg'} />
        </a>
      )
    },
    {
      title: 'Display Name',
      dataIndex: 'name',
      render(name: string, record: IPerformer) {
        return (
          <Link
            href={{
              pathname: '/creator/update/[id]',
              query: { id: record._id }
            }}
            as={`/creator/update/${record._id}`}
          >
            {name}
          </Link>
        );
      }
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
      title: 'Featured',
      dataIndex: 'isFeatured',
      render(isFeatured) {
        switch (isFeatured) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="red">N</Tag>;
        }
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status) {
        switch (status) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'inactive':
            return <Tag color="red">Inactive</Tag>;
          case 'pending-email-confirmation':
            return <Tag color="default">Not verified email</Tag>;
          default: return <Tag color="default">{status}</Tag>;
        }
      }
    },
    {
      title: 'Verified Email?',
      dataIndex: 'verifiedEmail',
      render(verifiedEmail) {
        switch (verifiedEmail) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="red">N</Tag>;
        }
      }
    },
    {
      title: 'Verified ID?',
      dataIndex: 'verifiedDocument',
      render(verifiedDocument) {
        switch (verifiedDocument) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="red">N</Tag>;
        }
      }
    },
    {
      title: 'Verified Account?',
      dataIndex: 'verifiedAccount',
      render(verifiedAccount) {
        switch (verifiedAccount) {
          case true:
            return <Tag color="green">Y</Tag>;
          case false:
            return <Tag color="red">N</Tag>;
          default: return <Tag color="red">N</Tag>;
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
                      pathname: '/creator/update/[id]',
                      query: { id }
                    }}
                    as={`/creator/update/${id}`}
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
              },
              {
                key: 'posts',
                name: 'Posts',
                children: (
                  <Link
                    href={{
                      pathname: '/feed',
                      query: { performerId: id }
                    }}
                    as={`/feed?performerId=${id}`}
                  >
                    <FireOutlined />
                    {' '}
                    My Posts
                  </Link>
                )
              },
              {
                key: 'videos',
                name: 'Videos',
                children: (
                  <Link
                    href={{
                      pathname: '/video',
                      query: { performerId: id }
                    }}
                    as={`/video?performerId=${id}`}
                  >
                    <VideoCameraOutlined />
                    {' '}
                    My Videos
                  </Link>
                )
              },
              {
                key: 'galleries',
                name: 'Galleries',
                children: (
                  <Link
                    href={{
                      pathname: '/gallery',
                      query: { performerId: id }
                    }}
                    as={`/gallery?performerId=${id}`}
                  >
                    <PictureOutlined />
                    {' '}
                    My Galleries
                  </Link>
                )
              },
              {
                key: 'photos',
                name: 'Photos',
                children: (
                  <Link
                    href={{
                      pathname: '/photos',
                      query: { performerId: id }
                    }}
                    as={`/photos?performerId=${id}`}
                  >
                    <PictureOutlined />
                    {' '}
                    My Photos
                  </Link>
                )
              },
              {
                key: 'product',
                name: 'Products',
                children: (
                  <Link
                    href={{
                      pathname: '/product',
                      query: { performerId: id }
                    }}
                    as={`/product?performerId=${id}`}
                  >
                    <SkinOutlined />
                    {' '}
                    My Products
                  </Link>
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
        <title>Creators</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Creators' }]} />
      <Page>
        <SearchFilter
          onSubmit={handleFilter}
          defaultValue={{
            status: `${router?.query?.status || ''}`,
            verifiedDocument: `${router?.query?.verifiedDocument || ''}`
          }}
        />
        <div className="table-responsive custom">
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
