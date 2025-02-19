import { showError } from '@lib/utils';
import { loginSocial } from '@redux/auth/actions';
import { authService } from '@services/auth.service';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSettings from 'src/hooks/use-settings';

import { TwitterIcon } from 'src/icons';
import style from './twitter-login-button.module.scss';

function TwitterLoginButton() {
  const { loading, data: settings } = useSettings(['twitterLoginEnabled']);
  const dispatch = useDispatch();
  const router = useRouter();

  const callbackTwitter = async () => {
    const twitterInfo = authService.getTwitterToken();
    if (!router?.query?.oauth_verifier || !twitterInfo.oauthToken || !twitterInfo.oauthTokenSecret) {
      return;
    }
    try {
      const auth = await authService.callbackLoginTwitter({
        oauth_verifier: typeof (router.query.oauth_verifier) === 'string' ? router.query.oauth_verifier : router.query.oauth_verifier[router.query.oauth_verifier.length - 1],
        oauthToken: twitterInfo.oauthToken,
        oauthTokenSecret: twitterInfo.oauthTokenSecret,
        callbackUrl: twitterInfo.callbackUrl,
        role: twitterInfo.role || 'user'
      });

      dispatch(loginSocial({ token: auth.data.token }));
      authService.clearTwitterToken();
    } catch (e) {
      showError(e, 'Twitter authentication login fail');
      authService.clearTwitterToken();
    }
  };

  const loginTwitter = async () => {
    try {
      // TODO - check and remove splash at the end?
      const callbackUrl = window.location.href.replace(/\/+$/, '');

      const resp = await (await authService.loginTwitter({
        callbackUrl
      })).data;
      authService.setTwitterToken({
        oauthToken: resp.oauth_token,
        oauthTokenSecret: resp.oauth_token_secret,
        callbackUrl
      }, 'user');
      window.location.href = resp.url;
    } catch (e) {
      showError(e, 'Twitter authentication login fail');
    }
  };

  useEffect(() => {
    callbackTwitter();
    return () => {
      authService.clearTwitterToken();
    };
  }, []);

  if (loading || !settings.twitterLoginEnabled) return null;

  return (
    <Button
      onClick={() => loginTwitter()}
      className={`${style['twitter-button']} ${style['btn-login']}`}
    >
      <div className={style['sign-in-twitter']}>
        <span className={style['icon-twitter']}>
          <TwitterIcon />
        </span>
        &nbsp;
        <p>SIGN IN WITH TWITTER</p>
      </div>

    </Button>
  );
}

export default TwitterLoginButton;
