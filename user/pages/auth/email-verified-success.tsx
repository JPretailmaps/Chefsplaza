import Link from 'next/link';
import SeoMetaHead from '@components/common/seo-meta-head';
import style from './email-verified-success.module.scss';

function EmailVerifiedSuccess() {
  return (
    <>
      <SeoMetaHead pageTitle="Email Verification" />
      <div className={style['email-verify-success']}>
        <p>
          Your email has been verified,
          <Link href="/auth/login">
            click here to login
          </Link>
        </p>
      </div>
    </>
  );
}

EmailVerifiedSuccess.authenticate = true;
EmailVerifiedSuccess.noredirect = true;
EmailVerifiedSuccess.layout = 'public';

export default EmailVerifiedSuccess;
