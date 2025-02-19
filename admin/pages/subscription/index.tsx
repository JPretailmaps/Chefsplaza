import { message } from 'antd';
import Head from 'next/head';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import { TableListSubscription } from '@components/subscription/table-list-subscription';
import { ISubscription } from 'src/interfaces';
import { subscriptionService } from '@services/subscription.service';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import { showError } from '@lib/message';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';

function SubscriptionPage() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleTableChange, handleFilter
  } = useClientFetch(buildUrl(subscriptionService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  const onCancelSubscription = async (subscription: ISubscription) => {
    if (!window.confirm('Are you sure you want to cancel the subscription?')) {
      return;
    }
    try {
      await subscriptionService.cancelSubscription(subscription._id, subscription.paymentGateway);
      message.success('The subscription has been cancelled');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  const onRenewSubscription = async (subscription: ISubscription) => {
    if (!window.confirm('Are you sure you want to reactivate this subscription?')) {
      return;
    }
    try {
      const {
        subscriptionType
      } = subscription;
      if (subscriptionType === 'yearly') {
        await subscriptionService.update(subscription._id, {
          expiredAt: moment().add(1, 'y'), subscriptionType, status: 'active'
        });
      } else if (subscriptionType === 'monthly') {
        await subscriptionService.update(subscription._id, {
          expiredAt: moment().add(1, 'M'), subscriptionType, status: 'active'
        });
      } else {
        await subscriptionService.update(subscription._id, {
          expiredAt: moment().add(1, 'd'), subscriptionType, status: 'active'
        });
      }
      message.success('This subscription have been reactivated');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  return (
    <>
      <Head>
        <title>Subscriptions</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Subscriptions' }]} />
      <Page>
        <SearchFilter searchWithPerformer onSubmit={handleFilter} keyword keywordPlaceholder="Filter by ID" />
        <div className="table-responsive">
          <TableListSubscription
            dataSource={data?.data || []}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize),
              position: ['bottomCenter'],
              showSizeChanger: false,
              simple: isMobile
            }}
            loading={isLoading}
            onChange={handleTableChange}
            rowKey="_id"
            onCancelSubscription={onCancelSubscription}
            onRenewSubscription={onRenewSubscription}
          />
        </div>
      </Page>
    </>
  );
}

export default SubscriptionPage;
