import Head from 'next/head';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { couponService } from '@services/coupon.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListCoupon } from '@components/coupon/table-list';
import { BreadcrumbComponent } from '@components/common';
import { isMobile } from 'react-device-detect';

interface IProps {
  performerId: string;
}

function Coupons(props: IProps) {
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
      const resp = await couponService.search({
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
    const { performerId } = props;
    if (performerId) {
      setFilter({
        ...filter,
        ...{ performerId }
      });
    }
    search();
  }, [filter]);

  const handleTableChange = (pagi, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagi.current;
    setPagination(pager);
    setSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
    search(pager.current);
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return false;
    }
    try {
      await couponService.delete(id);
      message.success('Deleted successfully');
      await search(pagination.current);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
    return undefined;
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
        <title>Coupons</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Coupons' }]} />
      <Page>
        <SearchFilter statuses={statuses} onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListCoupon
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{
              ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
            }}
            onChange={handleTableChange}
            deleteCoupon={deleteCoupon}
          />
        </div>
      </Page>
    </>
  );
}

Coupons.getInitialProps = async (ctx) => ctx.query;

export default Coupons;
