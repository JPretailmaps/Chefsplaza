/* eslint-disable no-nested-ternary */
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import { formatDate } from '@lib/date';
import { showError } from '@lib/message';
import { performerCategoryService } from '@services/perfomer-category.service';
import {
  Breadcrumb,
  Button,
  Dropdown, Menu,
  Table, message
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

function Categories() {
  const [pagination, setPagination] = useState({} as any);
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([] as any);
  const limit = 10;
  const [filter, setFilter] = useState({} as any);
  const [sortBy, setSortBy] = useState('ordering');
  const [sort, setSort] = useState('asc');

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await performerCategoryService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy
      });
      setSearching(false);
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit,
        responsive: Boolean
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      setSearching(false);
    }
  };

  const handleTableChange = (pagi, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagi.current;
    setPagination(pager);
    setSortBy(sorter.field || 'ordering');
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
    search(pager.current);
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
    search();
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await performerCategoryService.delete(id);
      message.success('Deleted successfully');
      await search(pagination.current);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    search();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render(data, record) {
        return (
          <Link
            href={{
              pathname: '/creator-category/update/[id]',
              query: {
                id: record._id
              }
            }}
            as={`/creator-category/update/${record._id}`}
          >
            {record.name}
          </Link>
        );
      }
    },
    {
      title: 'Ordering',
      dataIndex: 'ordering',
      sorter: true,
      render(ordering: number) {
        return <span>{ordering}</span>;
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
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="edit">
                <Link
                  href={{
                    pathname: '/creator-category/update/[id]',
                    query: {
                      id
                    }
                  }}
                  as={`/creator-category/update/${id}`}
                >
                  <EditOutlined />
                  {' '}
                  Update
                </Link>
              </Menu.Item>
              <Menu.Item
                key="delete"
                onClick={deleteCategory.bind(this, id)}
              >
                <span>
                  <DeleteOutlined />
                  {' '}
                  Delete
                </span>
              </Menu.Item>
            </Menu>
              )}
        >
          <Button>
            Actions
            {' '}
            <DownOutlined />
          </Button>
        </Dropdown>
      )
    }
  ];
  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Categories</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Page>
        <SearchFilter onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <Table
            dataSource={list}
            columns={columns}
            rowKey="_id"
            loading={searching}
            pagination={{
              ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
            }}
            onChange={handleTableChange}
          />
        </div>
      </Page>
    </>
  );
}

export default Categories;
