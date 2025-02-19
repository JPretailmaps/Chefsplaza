import { BankOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const BankingSettingsTabs = dynamic(() => import('@components/performer/tabs/bankingTabs'));

function BankingSettings() {
  return (
    <>
      <SeoMetaHead pageTitle="Banking (to earn)" />
      <div className="main-container">
        <PageHeading icon={<BankOutlined />} title="Banking (to earn)" />
        <BankingSettingsTabs />
      </div>
    </>
  );
}

BankingSettings.authenticate = true;
BankingSettings.onlyPerformer = true;

export default BankingSettings;
