import Head from 'next/head';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import { TableListPaymentTransaction } from '@components/payment/table-list-payment';
import { BreadcrumbComponent } from '@components/common';
import { paymentService } from '@services/payment.service';
import { isMobile } from 'react-device-detect';

function PaymentTransaction() {
  const [pagination, setPagination] = useState({} as any);
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([] as any);
  const [limit] = useState(10);
  const [filter, setFilter] = useState({} as any);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sort, setSort] = useState('desc');

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await paymentService.search({
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

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pag };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
    search(pager.current);
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const statuses = [
    {
      key: '',
      text: 'All'
    },
    {
      key: 'created',
      text: 'Created'
    },
    {
      key: 'processing',
      text: 'Processing'
    },
    {
      key: 'success',
      text: 'Success'
    },
    {
      key: 'fail',
      text: 'Fail'
    },
    {
      key: 'canceled',
      text: 'Cancelled'
    },
    {
      key: 'refunded',
      text: 'Refunded'
    }
  ];

  return (
    <>
      <Head>
        <title>Cash Payments</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Cash Payments' }]} />
      <Page>
        <SearchFilter dateRange statuses={statuses} onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListPaymentTransaction
            dataSource={list}
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

PaymentTransaction.getInitialProps = async (ctx) => ctx.query;

export default PaymentTransaction;
