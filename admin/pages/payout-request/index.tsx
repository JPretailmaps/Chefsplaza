import {
  message
} from 'antd';
import Head from 'next/head';
import { SearchFilter } from '@components/common/search-filter';
import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { RequestPayoutTable } from '@components/payout-request/table-list';
import { IPayoutRequest } from 'src/interfaces';
import { payoutRequestService } from 'src/services';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { useRouter } from 'next/router';

const statuses = [
  { text: 'All', key: '' },
  { text: 'Pending', key: 'pending' },
  { text: 'Rejected', key: 'rejected' },
  { text: 'Done', key: 'done' }
];

function PayoutRequestPage() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(payoutRequestService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const onDelete = async (request: IPayoutRequest) => {
    try {
      if (!window.confirm('Are you sure to delete this payout request?')) return;
      if (request.status !== 'pending') {
        message.error('Could not delete if status is not PENDING');
        return;
      }
      await payoutRequestService.delete(request._id);
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

  return (
    <>
      <Head>
        <title>Payout Requests</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Payout Requests' }]} />
      <Page>
        <SearchFilter
          statuses={statuses}
          onSubmit={handleFilter}
          searchWithPerformer
          dateRange
        />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <RequestPayoutTable
            dataSource={data?.data || []}
            loading={isLoading}
            rowKey="_id"
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize)
            }}
            onChange={handleTableChange}
            onDelete={onDelete}
          />
        </div>
      </Page>
    </>
  );
}
export default PayoutRequestPage;
