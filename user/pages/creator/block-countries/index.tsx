import { StopOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';

const PerformerBlockCountriesList = dynamic(() => import('@components/performer/list/performer-block-countries-list'));

function BlockCountries() {
  const performer = useSelector((state:any) => state.user.current);
  return (
    <>
      <SeoMetaHead pageTitle="Block Countries" />
      <div className="main-container user-account">
        <PageHeading title="Block Countries" icon={<StopOutlined />} />
        <PerformerBlockCountriesList performer={performer} />
      </div>
    </>
  );
}

BlockCountries.authenticate = true;
BlockCountries.onlyPerformer = true;

export default BlockCountries;
