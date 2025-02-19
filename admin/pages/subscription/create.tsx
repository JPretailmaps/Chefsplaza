import Head from 'next/head';
import { useState } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { FormSubscription } from '@components/subscription/form-subscription';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';
import { subscriptionService } from '@services/subscription.service';
import { showError } from '@lib/message';

function SubscriptionCreate() {
  const [submiting, setSubmiting] = useState(false);

  const submit = async (data) => {
    try {
      setSubmiting(true);
      await subscriptionService.create(data);
      message.success('Created successfully');
      Router.push(
        {
          pathname: '/subscription'
        }
      );
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <>
      <Head>
        <title>New subscription</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[{ title: 'Subscriptions', href: '/subscription' }, { title: 'New subscription' }]}
      />
      <Page>
        <FormSubscription onFinish={submit} submiting={submiting} />
      </Page>
    </>
  );
}

export default SubscriptionCreate;
