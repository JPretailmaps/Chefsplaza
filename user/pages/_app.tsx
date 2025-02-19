import '../style/index.scss';

import BaseLayout from '@layouts/base-layout';
import { clearToken, redirectLogin } from '@lib/utils';
import { loginSuccess } from '@redux/auth/actions';
import { updateSettings } from '@redux/settings/actions';
import { wrapper } from '@redux/store';
import { updateUIValue } from '@redux/ui/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { APIRequest } from '@services/api-request';
import {
  authService, settingService, userService
} from '@services/index';
import { pick } from 'lodash';
import { NextPageContext } from 'next';
import App from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import nextCookie from 'next-cookies';
import { Provider } from 'react-redux';
import { END } from 'redux-saga';
import { SETTING_KEYS } from 'src/constants';
import { Socket } from 'src/socket';
import Script from 'next/script';
import { Store } from 'redux';
import { ThemeProvider } from 'next-themes';
// eslint-disable-next-line camelcase
import { Merriweather_Sans } from 'next/font/google';

const myFont = Merriweather_Sans({ subsets: ['latin'] });

async function auth(
  ctx: NextPageContext,
  store: any,
  noredirect: boolean,
  onlyPerformer: boolean
) {
  try {
    const state = store.getState();
    const { token } = nextCookie(ctx);
    if (state.auth && state.auth.loggedIn) {
      return;
    }
    if (token) {
      authService.setToken(token);
      const user = await userService.me({
        Authorization: token
      });
      if (!user.data.isPerformer && onlyPerformer) {
        redirectLogin(ctx);
        return;
      }
      store.dispatch(loginSuccess());
      store.dispatch(updateCurrentUser(user.data));
      return;
    }
    !noredirect && redirectLogin(ctx);
  } catch (e) {
    redirectLogin(ctx);
  }
}

async function loadUser(token: string, store: Store, ctx: NextPageContext) {
  if (!token) return;
  const state = store.getState();
  if (state.auth && state.auth.loggedIn) {
    return;
  }
  try {
    authService.setToken(token);
    const user = await userService.me({
      Authorization: token
    });
    // TODO - check permission
    store.dispatch(loginSuccess());
    store.dispatch(updateCurrentUser(user.data));
    // eslint-disable-next-line no-empty
  } catch {
    clearToken(ctx);
  }
}

async function updateSettingsStore(store: Store, settings) {
  store.dispatch(
    updateUIValue({
      darkmodeLogo: settings.darkmodeLogoUrl || settings.logoUrl || '',
      logo: settings.logoUrl || '',
      siteName: settings.siteName || '',
      favicon: settings.favicon || '',
      menus: settings.menus || []
    })
  );

  store.dispatch(
    updateSettings(
      pick(settings, [
        SETTING_KEYS.REQUIRE_EMAIL_VERIFICATION,
        SETTING_KEYS.STRIPE_PUBLISHABLE_KEY,
        SETTING_KEYS.PAYMENT_GATEWAY,
        SETTING_KEYS.GOOGLE_ANALYTICS_CODE,
        SETTING_KEYS.FREE_SUBSCRIPTION_ENABLED,
        SETTING_KEYS.FREE_SUBSCRIPTION_DURATION,
        SETTING_KEYS.MINIMUM_SUBSCRIPTION_PRICE,
        SETTING_KEYS.MAXIMUM_SUBSCRIPTION_PRICE,
        SETTING_KEYS.MINIMUM_WALLET_PRICE,
        SETTING_KEYS.MAXIMUM_WALLET_PRICE,
        SETTING_KEYS.MINIMUM_TIP_PRICE,
        SETTING_KEYS.MAXIMUM_TIP_PRICE,
        SETTING_KEYS.MINIMUM_PAYOUT_AMOUNT
      ])
    )
  );
}

type IApplication = {
  Component: any;
  pageProps: any;
  maintenanceMode: boolean;
};

function Application({
  Component,
  ...rest
}: IApplication) {
  const { layout } = Component;
  const { store, props } = wrapper.useWrappedStore(rest);
  const state = store.getState();
  const ga = state?.settings?.gaCode || '';
  const maintenanceMode = !!props?.maintenanceMode;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="robots" content="index,follow" />
        {ga && <link rel="dns-prefetch" href="https://www.googletagmanager.com" />}
        {ga && <link rel="preconnect" href="https://www.google-analytics.com" />}
      </Head>
      {ga && <Script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />}
      {ga && (
        <Script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga}');`
          }}
        />
      )}
      <Script src="/lib/cubiq.min.js" />
      <ThemeProvider enableSystem={false} themes={['light', 'dark']}>
        <Provider store={store}>
          <Socket>
            <main className={myFont.className}>
              <BaseLayout layout={layout} maintenance={maintenanceMode}>
                <Component {...props.pageProps} />
              </BaseLayout>
            </main>
          </Socket>
        </Provider>
      </ThemeProvider>
    </>

  );
}

Application.getInitialProps = wrapper.getInitialAppProps((store) => async (context) => {
  const { Component, ctx } = context;
  let maintenanceMode = false;
  // NOTE - do not move this line to condition above, will theor error
  if (typeof window === 'undefined') {
    const { serverRuntimeConfig } = getConfig();
    APIRequest.API_ENDPOINT = serverRuntimeConfig.API_ENDPOINT;

    // server side to load settings, once time only
    const settings = await settingService.all();
    maintenanceMode = settings.maintenanceMode;
    await updateSettingsStore(store, {
      ...settings
    });
  }
  // won't check auth for un-authenticated page such as login, register
  // use static field in the component
  const { noredirect, authenticate, onlyPerformer } = Component as any;
  const { token } = nextCookie(ctx);
  // load user if needed
  if (token) {
    await loadUser(token, store, ctx);
  } else if (authenticate) await auth(ctx, store, noredirect, onlyPerformer);

  // Wait for all page actions to dispatch
  const pageProps = {
    // https://nextjs.org/docs/advanced-features/custom-app#caveats
    ...(await App.getInitialProps(context)).pageProps
  };

  // Stop the saga if on server
  if (typeof window === 'undefined') {
    store.dispatch(END);
    await (store as any).sagaTask.toPromise();
  }

  return {
    pageProps,
    maintenanceMode
  };
});

export default Application;
