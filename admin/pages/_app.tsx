/* eslint-disable react/prop-types */
import '../style/global.scss';

import BaseLayout from '@layouts/base-layout';
import { redirectLogin } from '@lib/utils';
import { loginSuccess } from '@redux/auth/actions';
import { wrapper } from '@redux/store';
import { updateUIValue } from '@redux/ui/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { APIRequest } from '@services/api-request';
import {
  settingService, userService
} from '@services/index';
import { NextPageContext } from 'next';
import App from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import nextCookie from 'next-cookies';
import React from 'react';
import { Provider } from 'react-redux';
import { END } from 'redux-saga';
import { ThemeProvider } from 'next-themes';
// eslint-disable-next-line camelcase
import { Merriweather_Sans } from 'next/font/google';

const myFont = Merriweather_Sans({ subsets: ['latin'] });

async function auth(ctx: NextPageContext, store) {
  try {
    const state = store.getState();
    if (state.auth && state.auth.loggedIn) {
      return;
    }
    // TODO - move to a service
    const { token } = nextCookie(ctx);
    if (!token) {
      // log out and redirect to login page
      // TODO - reset app state?
      redirectLogin(ctx);
      return;
    }
    const user = await userService.me({
      Authorization: token
    });
    // TODO - check permission
    if (user.data?.isPerformer || (user.data.roles && !user.data.roles.includes('admin'))) {
      redirectLogin(ctx);
      return;
    }
    store.dispatch(loginSuccess());
    store.dispatch(updateCurrentUser(user.data));
  } catch (e) {
    redirectLogin(ctx);
  }
}

async function updateSettingsStore(store, settings) {
  store.dispatch(
    updateUIValue({
      logo: settings.logoUrl,
      darkmodeLogo: settings.darkmodeLogoUrl || settings.logoUrl || '',
      siteName: settings.siteName
    })
  );
}

function Application({
  Component,
  ...rest
}) {
  const { layout } = Component;
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <ThemeProvider enableSystem={false} themes={['light', 'dark']} defaultTheme="light">
        <Provider store={store}>
          <main className={myFont.className}>
            <BaseLayout layout={layout}>
              <Component {...props.pageProps} />
            </BaseLayout>
          </main>
        </Provider>
      </ThemeProvider>
    </>
  );
}

Application.getInitialProps = wrapper.getInitialAppProps((store) => async (context: any) => {
  const { Component, ctx } = context;
  if (typeof window === 'undefined') {
    const { serverRuntimeConfig } = getConfig();
    APIRequest.API_ENDPOINT = serverRuntimeConfig.API_ENDPOINT;

    const settings = await settingService.public();
    await updateSettingsStore(store, settings);
  }
  // won't check auth for un-authenticated page such as login, register
  // use static field in the component
  const { noAuthenticate } = Component as any;
  const { token } = nextCookie(ctx);
  (context as any).token = token || '';
  if (!noAuthenticate) await auth(ctx, store);

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
    pageProps
  };
});

export default Application;
