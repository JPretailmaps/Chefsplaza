/* eslint-disable no-nested-ternary */
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { menuService } from '@services/menu.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListMenu } from '@components/menu/table-list';
import { BreadcrumbComponent } from '@components/common';
import { isMobile } from 'react-device-detect';

function Menus() {
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
      const resp = await menuService.search({
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

  const handleFilter = (values) => {
    setFilter({
      ...filter,
      ...values
    });
    search();
  };

  const handleTableChange = (pagi, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagi.current;
    setPagination(pager);
    setSortBy(sorter.field || 'createdAt');
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
    search();
  };

  const deleteMenu = async (id: string) => {
    if (!window.confirm('Are you sure to delete this menu?')) {
      return;
    }
    try {
      await menuService.delete(id);
      message.success('Deleted successfully');
      await search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <Head>
        <title>Menu Options</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Menu Options' }]} />
      <Page>
        <SearchFilter onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListMenu
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{
              ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
            }}
            onChange={handleTableChange}
            deleteMenu={deleteMenu}
          />
        </div>
      </Page>
    </>
  );
}

export default Menus;
