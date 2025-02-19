import { HistoryOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import { SearchFilter } from '@components/common/search-filter';
import SeoMetaHead from '@components/common/seo-meta-head';
import PaymentTableList from '@components/user/payment-token-history-table';
import { showError } from '@lib/utils';
import { useEffect, useState } from 'react';
import { ITransaction } from 'src/interfaces';
import { tokenTransctionService } from 'src/services';

function PurchasedItemHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [paymentList, setPaymentList] = useState<ITransaction[]>();
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');
  const [filter, setFilter] = useState({});

  const search = async () => {
    try {
      setLoading(true);
      const resp = await tokenTransctionService.userSearch({
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

  const handleTableChange = (pag, filters, sorter) => {
    setPagination({ ...pagination, current: pag.current });
    setSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const type = [
    {
      key: '',
      text: 'All types'
    },
    {
      key: 'feed',
      text: 'Post'
    },
    {
      key: 'product',
      text: 'Product'
    },
    {
      key: 'gallery',
      text: 'Gallery'
    },
    {
      key: 'video',
      text: 'Video'
    },
    {
      key: 'tip',
      text: 'Creator Tip'
    },
    {
      key: 'stream_tip',
      text: 'Streaming Tip'
    },
    {
      key: 'public_chat',
      text: 'Streaming'
    }
  ];
  return (
    <>
      <SeoMetaHead pageTitle="Wallet Transactions" />
      <div className="main-container">
        <PageHeading title="Wallet Transactions" icon={<HistoryOutlined />} />
        <SearchFilter
          type={type}
          searchWithPerformer
          onSubmit={handleFilter}
          dateRange
        />
        <PaymentTableList
          dataSource={paymentList}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="_id"
          loading={loading}
        />
      </div>
    </>
  );
}

PurchasedItemHistoryPage.authenticate = true;

export default PurchasedItemHistoryPage;
