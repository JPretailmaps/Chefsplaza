import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { OrderSearchFilter } from '@components/order';
import OrderTableList from '@components/order/table-list';
import { showError } from '@lib/message';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { orderService } from '@services/index';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface IProps {
  deliveryStatus: string;
}

function ModelOrderPage({ deliveryStatus }: IProps) {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleTableChange, handleFilter
  } = useClientFetch(buildUrl(orderService.searchEndpoint(), {
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
      <Head>
        <title>Order History</title>
      </Head>
      <Page>
        <div className="main-container">
          <BreadcrumbComponent
            breadcrumbs={[
              { title: 'Order History', href: '/order' }
            ]}
          />
          <OrderSearchFilter
            onSubmit={handleFilter}
            defaultDeliveryStatus={deliveryStatus}
          />
          <div style={{ marginBottom: '20px' }} />
          <div className="table-responsive">
            <OrderTableList
              dataSource={data?.data || []}
              rowKey="_id"
              loading={isLoading}
              pagination={{
                total: data?.total || 0,
                current: Number(current),
                pageSize: Number(pageSize)
              }}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </Page>
    </>
  );
}

ModelOrderPage.getInitialProps = async (ctx) => ctx.query;

export default ModelOrderPage;
