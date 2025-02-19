import { SearchFilter } from '@components/common/search-filter';
import { PerformerTableListSubscription } from '@components/subscription/performer-table-list-subscription';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';
import { subscriptionService } from '@services/subscription.service';
import { useRouter } from 'next/router';

const statuses = [
  {
    key: '',
    text: 'All Statuses'
  },
  {
    key: 'active',
    text: 'Active'
  },
  {
    key: 'deactivated',
    text: 'Inactive'
  },
  {
    key: 'suspended',
    text: 'Suspended'
  }
];
const types = [
  {
    key: '',
    text: 'All Types'
  },
  {
    key: 'free',
    text: 'Free Subscription'
  },
  {
    key: 'monthly',
    text: 'Monthly Subscription'
  },
  {
    key: 'yearly',
    text: 'Yearly Subscription'
  }
];

function PerformerSubscriberList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(subscriptionService.performerSearchUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  return (
    <>
      <SearchFilter
        subscriptionTypes={types}
        statuses={statuses}
        dateRange
        onSubmit={handleFilter}
      />
      <div className="table-responsive">
        <PerformerTableListSubscription
          dataSource={data?.data || []}
          pagination={{
            total: data?.total || 0,
            pageSize: Number(pageSize),
            current: Number(current)
          }}
          loading={isLoading}
          onChange={handleTableChange}
          rowKey="_id"
        />
      </div>
    </>
  );
}

export default PerformerSubscriberList;
