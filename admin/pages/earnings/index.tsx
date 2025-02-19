import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  message, Statistic, Space
} from 'antd';
import Page from '@components/common/layout/page';
import { earningService } from '@services/earning.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListEarning } from '@components/earning/table-list-earning';
import { BreadcrumbComponent } from '@components/common';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import style from './earnings.module.scss';

interface IEarningStatResponse {
  totalSiteCommission: number;
  totalGrossPrice: number;
  totalNetPrice: number;
}

function Earning() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'createdAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(earningService.searchEndpoint(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  const {
    data: stats
  } = useClientFetch(buildUrl(earningService.statsEndpoint(), {
    ...router.query
  }));

  const type = [
    {
      key: '',
      text: 'All Types'
    },
    { key: 'tip', text: 'Tip' },
    { key: 'feed', text: 'Post' },
    { key: 'video', text: 'Video' },
    { key: 'gallery', text: 'Gallery' },
    { key: 'product', text: 'Product' },
    { key: 'stream_tip', text: 'Streaming tip' },
    { key: 'public_chat', text: 'Streaming' },
    {
      key: 'monthly_subscription',
      text: 'Monthly Subscription'
    },
    {
      key: 'yearly_subscription',
      text: 'Yearly Subscription'
    }
  ];

  return (
    <>
      <Head>
        <title>Earnings Report</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Earnings Report' }]} />
      <Page>
        <div className={style['earning-stats']}>
          <Space size="large">
            <Statistic title="Total Earnings" prefix="$" value={stats?.totalGrossPrice || 0} precision={2} />
            <Statistic title="Platform Earnings" prefix="$" value={stats?.totalSiteCommission || 0} precision={2} />
            <Statistic title="Creators Earnings" prefix="$" value={stats?.totalNetPrice || 0} precision={2} />
          </Space>
        </div>
        <SearchFilter
          type={type}
          onSubmit={handleFilter}
          searchWithPerformer
          dateRange
        />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListEarning
            dataSource={data?.data || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
              total: data?.total || 0,
              current: Number(current),
              pageSize: Number(pageSize),
              position: ['bottomCenter'],
              simple: isMobile
            }}
            onChange={handleTableChange}
          />
        </div>
      </Page>
    </>
  );
}

Earning.getInitialProps = async (ctx) => ctx.query;

export default Earning;
