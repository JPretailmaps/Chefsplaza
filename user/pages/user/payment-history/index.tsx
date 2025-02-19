import { HistoryOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import { SearchFilter } from '@components/common/search-filter';
import SeoMetaHead from '@components/common/seo-meta-head';
import PaymentTableList from '@components/payment/table-list';
import { showError } from '@lib/utils';
import { useEffect, useState } from 'react';
import { paymentService } from 'src/services';

function PaymentHistoryPage() {
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [loading, setLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sort, setSort] = useState('desc');

  const search = async () => {
    try {
      const resp = await paymentService.userSearch({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setPaymentList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total
      });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = async (pag, filters, sorter) => {
    setPagination({ ...pagination, current: pag.current });
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
  };

  const handleFilter = async (values) => {
    setFilter({ ...filter, ...values });
  };

  const statuses = [
    {
      key: '',
      text: 'All Statuses'
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
      key: 'require_authentication',
      text: 'Require authentication'
    },
    {
      key: 'fail',
      text: 'Fail'
    },
    {
      key: 'success',
      text: 'Success'
    },
    {
      key: 'canceled',
      text: 'Cancelled'
    }
  ];
  return (
    <>
      <SeoMetaHead pageTitle="Payment History" />
      <div className="main-container">
        <PageHeading title="Payment History" icon={<HistoryOutlined />} />
        <SearchFilter
          statuses={statuses}
          onSubmit={handleFilter}
          searchWithPerformer
          dateRange
        />
        <PaymentTableList
          dataSource={paymentList}
          pagination={pagination}
          onChange={handleTableChange}
          loading={loading}
          rowKey="_id"
        />
      </div>
    </>
  );
}

export default PaymentHistoryPage;
