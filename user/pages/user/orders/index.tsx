import {
  ShoppingCartOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import { OrderSearchFilter } from '@components/order';
import OrderTableList from '@components/order/table-list';
import { orderService } from '@services/index';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IUser } from 'src/interfaces';

interface IProps {
  user: IUser;
}

function UserOrderPage(props: IProps) {
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    current: 1
  });
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([]);
  const [limit] = useState(10);
  const [filter, setFilter] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await orderService.userSearch({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sort,
        sortBy
      });
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, [filter]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
    search(pager.current);
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const { user } = props;
  return (
    <>
      <SeoMetaHead pageTitle="My Orders" />
      <div className="main-container">
        <PageHeading title="My Orders" icon={<ShoppingCartOutlined />} />
        <OrderSearchFilter
          onSubmit={handleFilter}
        />
        <OrderTableList
          user={user}
          dataSource={list}
          rowKey="_id"
          loading={searching}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </>
  );
}

UserOrderPage.authenticate = true;

UserOrderPage.getInitialProps = async (ctx) => ctx.query;

const mapStates = (state: any) => ({
  user: { ...state.user.current }
});
export default connect(mapStates)(UserOrderPage);
