import dynamic from 'next/dynamic';
import SeoMetaHead from '@components/common/seo-meta-head';
import { performerCategoryService } from '@services/perfomer-category.service';
import { IPerformerCategory } from '@interfaces/performer-category';

const AccountSettingsTabs = dynamic(() => import('@components/performer/tabs/accountTabs'));

type P = { categories: IPerformerCategory[] }

function AccountSettings({ categories }: P) {
  return (
    <>
      <SeoMetaHead pageTitle="Edit Profile" />
      <div className="main-container">
        <AccountSettingsTabs categories={categories} />
      </div>
    </>
  );
}

AccountSettings.authenticate = true;
AccountSettings.onlyPerformer = true;

export const getServerSideProps = async () => {
  const resp = await performerCategoryService.search({ limit: 500 });
  return {
    props: {
      categories: resp?.data?.data || []
    }
  };
};

export default AccountSettings;
