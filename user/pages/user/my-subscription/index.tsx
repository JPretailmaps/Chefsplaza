import { HeartOutlined } from '@ant-design/icons';
import { SearchFilter } from '@components/common';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { UserTableListSubscription } from '@components/subscription/user-table-list-subscription';
import { showError } from '@lib/utils';
import { setSubscription } from '@redux/subscription/actions';
import { subscriptionService } from '@services/index';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  ISubscription, IUser
} from 'src/interfaces';

interface IProps {
  user: IUser;
  setSubscription: Function;
}

function SubscriptionPage(props: IProps) {
  const limit = 10;
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await subscriptionService.userSearch({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setList(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = async (page, filters, sorter) => {
    const pager = { ...page };
    pager.current = page.current;
    setPagination(page);
    if (sorter) {
      setSortBy(sorter.field || 'createdAt');
      // eslint-disable-next-line no-nested-ternary
      setSort(sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc');
    }
  };

  const handleFilter = async (values) => {
    setFilter((f) => ({ ...f, ...values }));
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const cancelSubscription = async (subscription: ISubscription) => {
    if (!window.confirm('Are you sure you want to cancel this subscription!')) return;
    try {
      await subscriptionService.cancelSubscription(subscription._id, subscription.paymentGateway);
      message.success('Subscription cancelled successfully');
      getData();
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Error occurred, please try again later');
    }
  };

  const activeSubscription = (subscription: ISubscription) => {
    const { user, setSubscription: updateSubscription } = props;
    const { performerInfo: performer } = subscription;
    if (user.isPerformer || !performer) return;
    updateSubscription({ showModal: true, performer, subscriptionType: subscription.subscriptionType });
  };
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

  return (
    <>
      <SeoMetaHead pageTitle="My Subscriptions" />
      <div className="main-container">
        <PageHeading title="My Subscriptions" icon={<HeartOutlined />} />
        <SearchFilter
          statuses={statuses}
          subscriptionTypes={types}
          searchWithPerformer
          onSubmit={handleFilter}
        />
        <div className="table-responsive">
          <UserTableListSubscription
            dataSource={list}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            rowKey="_id"
            cancelSubscription={cancelSubscription}
            activeSubscription={activeSubscription}
          />
        </div>
      </div>
    </>
  );
}

const mapState = (state: any) => ({
  user: { ...state.user.current }
});
const mapDispatch = { setSubscription };
export default connect(mapState, mapDispatch)(SubscriptionPage);
