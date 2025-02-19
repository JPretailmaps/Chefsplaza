import dynamic from 'next/dynamic';

import { Divider } from 'antd';
import useSettings from 'src/hooks/use-settings';
import { GoogleOAuthProvider } from '@react-oauth/google';
import style from './social-login-group.module.scss';

const TwitterLoginButton = dynamic(() => import('@components/auth/twitter-login-button'));
const GoogleLoginButton = dynamic(() => import('@components/auth/google-login-button'));

export function SocialLoginGroup() {
  const { data: settings } = useSettings(['googleLoginEnabled', 'googleLoginClientId']);

  return (
    <div className={style['social-login']}>
      <TwitterLoginButton />
      {settings.googleLoginClientId && settings.googleLoginEnabled && (
      <GoogleOAuthProvider clientId={settings.googleLoginClientId}>
        <GoogleLoginButton
          googleLoginClientId={settings.googleLoginClientId}
        />
      </GoogleOAuthProvider>
      )}
    </div>
  );
}

export default SocialLoginGroup;
