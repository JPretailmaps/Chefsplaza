import { EditOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import UserAccountFormComponent from '@components/user/account-form';

function UserAccountSettingPage() {
  return (
    <>
      <SeoMetaHead pageTitle="Edit Profile" />
      <div className="main-container user-account">
        <PageHeading title="Edit Profile" icon={<EditOutlined />} />
        <UserAccountFormComponent />
      </div>
    </>
  );
}

export default UserAccountSettingPage;
