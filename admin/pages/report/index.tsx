import Page from '@components/common/layout/page';
import ReportTableList from '@components/report/report-table-list';
import { reportService } from '@services/report.service';
import Head from 'next/head';
import { BreadcrumbComponent } from '@components/common';
import { useRouter } from 'next/router';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/message';

export default function ReportList() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleTableChange
  } = useClientFetch(buildUrl(reportService.searchEndpoint(), {
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
        <title>Newsfeed Reports</title>
      </Head>
      <div className="main-container">
        <BreadcrumbComponent breadcrumbs={[{ title: 'Newsfeed Reports' }]} />
        <Page>
          <div className="table-responsive">
            <ReportTableList
              items={data?.data || []}
              searching={isLoading}
              total={data?.total || 0}
              onChange={handleTableChange}
              pageSize={Number(pageSize)}
            />
          </div>
        </Page>
      </div>
    </>
  );
}
