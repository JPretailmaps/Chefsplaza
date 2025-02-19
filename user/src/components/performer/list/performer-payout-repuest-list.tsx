import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';
import { payoutRequestService } from '@services/payout-request.service';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import PayoutRequestList from 'src/components/payout-request/table';

function PerformerPayoutRequestList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleTableChange
  } = useClientFetch(buildUrl(payoutRequestService.performerSearchUrl(), {
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
      <div style={{ margin: '10px 0' }}>
        <Button
          type="primary"
          onClick={() => router.push('/creator/payout-request/create')}
        >
          Request a Payout
        </Button>
      </div>
      <div className="table-responsive">
        <PayoutRequestList
          payouts={data?.data || []}
          searching={isLoading}
          total={data?.total || 0}
          onChange={handleTableChange}
          pageSize={Number(pageSize)}
        />
      </div>
    </>
  );
}

export default PerformerPayoutRequestList;
