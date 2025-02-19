import { TableListEarning } from '@components/earning/table-earning';
import { showError } from '@lib/utils';
import {
  Statistic
} from 'antd';
import { SearchFilter } from 'src/components/common/search-filter';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { useRouter } from 'next/router';
import { earningService } from '@services/earning.service';
import style from './performer-earning-list.module.scss';

function PerformerEarningList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'createdAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(earningService.performerSearchUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const {
    data: stats
  } = useClientFetch(buildUrl(earningService.performerStatsUrl(), {
    ...router.query
  }));

  if (error) {
    showError(error);
  }

  return (
    <>
      <SearchFilter
        type={[
          { key: '', text: 'All types' },
          { key: 'product', text: 'Product' },
          { key: 'gallery', text: 'Gallery' },
          { key: 'feed', text: 'Post' },
          { key: 'video', text: 'Video' },
          { key: 'tip', text: 'Tip' },
          { key: 'stream_tip', text: 'Streaming tip' },
          { key: 'public_chat', text: 'Paid steaming' },
          { key: 'monthly_subscription', text: 'Monthly Subscription' },
          { key: 'yearly_subscription', text: 'Yearly Subscription' }
        ]}
        onSubmit={handleFilter}
        dateRange
      />
      <div className={style['stats-earning']}>
        <Statistic
          title="Total"
          prefix="$"
          value={stats?.totalGrossPrice || 0}
          precision={2}
        />
        <Statistic
          title="Platform commission"
          prefix="$"
          value={stats?.totalSiteCommission || 0}
          precision={2}
        />
        <Statistic
          title="Your Earnings"
          prefix="$"
          value={stats?.totalNetPrice || 0}
          precision={2}
        />
      </div>
      <div className="table-responsive">
        <TableListEarning
          dataSource={data?.data || []}
          rowKey="_id"
          pagination={{
            current: Number(current),
            pageSize: Number(pageSize),
            total: data?.total || 0
          }}
          loading={isLoading}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

export default PerformerEarningList;
