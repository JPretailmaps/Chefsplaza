import SeoMetaHead from '@components/common/seo-meta-head';
import { settingService } from '@services/setting.service';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect } from 'react';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import Router from 'next/router';
import { Button } from 'antd';
import Link from 'next/link';
import style from './login.module.scss';

const SocialLoginGroup = dynamic(() => import('@components/auth/social-login-group'));
const LoginForm = dynamic(() => import('@components/auth/login-form'));
const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

type Props = {
  title: string;
  metaKeywords: string;
  metaDescription: string;
  loginPlaceholderImage: string;
  googleLoginClientId: string;
};

function Login({
  title,
  metaKeywords,
  metaDescription,
  loginPlaceholderImage,
  googleLoginClientId
}: Props) {
  const handleLoggedInRedirect = async () => {
    const token = authService.getToken();
    if (!token) return;
    try {
      const user = await userService.me({
        Authorization: token || ''
      });

      if (user.data.isPerformer) {
        Router.push(`/${user.data.username}`);
        return;
      }
      Router.push('/home');
    } catch (e) {
      authService.removeToken();
    }
  };

  useEffect(() => {
    handleLoggedInRedirect();
  }, []);

  return (
    <>
      <SeoMetaHead
        pageTitle={title || 'Login'}
        keywords={metaKeywords}
        description={metaDescription}
      />
      <div className={style['main-container']}>
        <div className={style['login-box']}>
          <div className={`${style['content-left']}`}>
            <Image
              alt="welcome-placeholder"
              fill
              priority
              quality={70}
              sizes="(max-width: 768px) 100vw, (max-width: 2100px) 40vw"
              src={loginPlaceholderImage || '/auth-img.png'}
            />
          </div>
          <div className={`${style['content-right']}`}>
            <div className={style['button-content-right']}>
              <Button className={style['custom-button']} style={{ backgroundColor: '#ccffcc', borderColor: '#7FCF00', borderWidth: '3px' }}>
                <Link href="/chefsplaza/index.html" passHref>
                  <span style={{ color: '#000', fontWeight: 'bold' }}>Home</span>
                </Link>
              </Button>
              <Button className={style['custom-button']} style={{ backgroundColor: '#ccffcc', borderColor: '#7FCF00', borderWidth: '3px' }}>
                <Link href="/chefsplaza/become-a-chef.html" passHref>
                  <span style={{ color: '#000', fontWeight: 'bold' }}>Become a Chef</span>
                </Link>
              </Button>
              <Button className={style['custom-button']} style={{ backgroundColor: '#ccffcc', borderColor: '#7FCF00', borderWidth: '3px' }}>
                <Link href="/auth/creator-register" passHref>
                  <span style={{ color: '#000', fontWeight: 'bold' }}>Sign up</span>
                </Link>
              </Button>
            </div>
            <LoginForm />
            <SocialLoginGroup />
          </div>
        </div>
      </div>
    </>
  );
}

Login.authenticate = false;
Login.layout = 'public';

export const getServerSideProps = async () => {
  const meta = await settingService.valueByKeys([
    'homeTitle',
    'homeMetaKeywords',
    'homeMetaDescription',
    'loginPlaceholderImage'
  ]);
  return {
    props: {
      title: meta?.homeTitle || '',
      metaKeywords: meta?.homeMetaKeywords || '',
      metaDescription: meta?.homeMetaDescription || '',
      loginPlaceholderImage: meta?.loginPlaceholderImage || ''
    }
  };
};

export default Login;
