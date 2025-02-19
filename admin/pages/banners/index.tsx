import Head from 'next/head';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { bannerService } from '@services/banner.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListBanner } from '@components/banner/table-list';
import { BreadcrumbComponent } from '@components/common';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

function Banners() {
  const [pagination, setPagination] = useState({} as any);
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([] as any);
  const [limit] = useState(10);
  const [filter, setFilter] = useState({} as any);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await bannerService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy
      });
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit,
        responsive: Boolean
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, [filter]);

  const handleTableChange = (paginate, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = paginate.current;
    setPagination(pager);
    setSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
    search(pager.current);
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const deleteBanner = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    try {
      await bannerService.delete(id);
      message.success('Deleted successfully');
      await search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  };

  const statuses = [
    {
      key: '',
      text: 'All'
    },
    {
      key: 'active',
      text: 'Active'
    },
    {
      key: 'inactive',
      text: 'Inactive'
    }
  ];

  return (
    <>
      <Head>
        <title>Banners</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Banners' }]} />
      <Page>
        <SearchFilter statuses={statuses} onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListBanner
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{
              ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
            }}
            onChange={handleTableChange}
            deleteBanner={deleteBanner}
          />
        </div>
      </Page>
    </>
  );
}

export default Banners;
