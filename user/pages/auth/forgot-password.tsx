import SeoMetaHead from '@components/common/seo-meta-head';
import { settingService } from '@services/setting.service';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next/types';

const ForgotPasswordForm = dynamic(() => import('@components/auth/forgot-password-form'));

type P = {
  loginPlaceholderImage: string;
}

function Forgot({ loginPlaceholderImage }: P) {
  return (
    <div className="main-container">
      <SeoMetaHead pageTitle="Forgot Password" />
      <ForgotPasswordForm loginPlaceholderImage={loginPlaceholderImage} />
    </div>
  );
}

Forgot.authenticate = false;
Forgot.layout = 'public';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const meta = await settingService.valueByKeys([
    'loginPlaceholderImage'
  ]);

  return {
    props: {
      loginPlaceholderImage: meta?.loginPlaceholderImage || ''
    }
  };
};

export default Forgot;
