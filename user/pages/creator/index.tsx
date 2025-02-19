import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import PerformerGridCard from '@components/performer/card/grid-card';
import dynamic from 'next/dynamic';
import {
  Col, Pagination, Row, Spin
} from 'antd';
import { ModelIcon } from 'src/icons';
import { performerService } from 'src/services';
import { showError } from '@lib/utils';
import { StyleProvider } from '@ant-design/cssinjs';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';

const PerformerAdvancedFilter = dynamic(() => import('@components/performer/common/performer-advanced-filter'));

function Performers() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 12
  } = router.query;

  const {
    data, error, isLoading, handleFilter, handlePaginationChange
  } = useClientFetch(buildUrl(performerService.searchUrl(), {
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
      <SeoMetaHead pageTitle="Creators" />
      <div className="main-container">
        <PageHeading title="Creators" icon={<ModelIcon />} />
        <PerformerAdvancedFilter onSubmit={handleFilter} />
        <Row>
          {data?.data.length > 0 && data.data.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <PerformerGridCard performer={p} />
            </Col>
          ))}
        </Row>
        {!data?.total && !isLoading && <p className="text-center" style={{ margin: 20 }}>No profile was found</p>}
        {isLoading && (
          <div className="text-center" style={{ margin: 30 }}>
            <Spin />
          </div>
        )}
        <div className="text-center" style={{ margin: '20px 0' }}>
          {data?.total > 0 && data?.total > Number(pageSize) && (
            <StyleProvider hashPriority="high">
              <Pagination
                current={Number(current)}
                total={data?.total || 0}
                pageSize={Number(pageSize)}
                onChange={handlePaginationChange.bind(this)}
                showSizeChanger
                simple={isMobile}
              />
            </StyleProvider>
          )}
        </div>
      </div>
    </>
  );
}

Performers.authenticate = true;
Performers.noredirect = true;

export default Performers;
