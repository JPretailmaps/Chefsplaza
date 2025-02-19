import { OrderSearchFilter } from '@components/order';
import OrderTableList from '@components/order/table-list';
import { IUser } from '@interfaces/user';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';
import { orderService } from '@services/order.service';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

function PerformerOrderList() {
  const user = useSelector((state: any) => state.user.current) as IUser;
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(orderService.performerSearchUrl(), {
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
      <OrderSearchFilter
        onSubmit={handleFilter}
      />
      <OrderTableList
        user={user}
        dataSource={data?.data || []}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          current: Number(current),
          pageSize: Number(pageSize),
          total: data?.total || 0
        }}
        onChange={handleTableChange}
      />
    </>
  );
}

export default PerformerOrderList;
