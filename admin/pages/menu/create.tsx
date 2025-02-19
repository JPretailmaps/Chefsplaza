import Head from 'next/head';
import { useState } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { menuService } from '@services/menu.service';
import { FormMenu } from '@components/menu/form-menu';
import { BreadcrumbComponent } from '@components/common';
import Router from 'next/router';

function MenuCreate() {
  const [submiting, setSubmiting] = useState(false);

  const submit = async (data: any) => {
    try {
      setSubmiting(true);

      const submitData = {
        ...data,
        value: data.value / 100
      };
      await menuService.create(submitData);
      message.success('Created successfully');
      // TODO - redirect
      setSubmiting(false);
      Router.push('/menu');
    } catch (e) {
      // TODO - check and show error here
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'Something went wrong, please try again!');
      setSubmiting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New</title>
      </Head>
      <BreadcrumbComponent breadcrumbs={[{ title: 'Menus', href: '/menu' }, { title: 'Create New' }]} />
      <Page>
        <FormMenu onFinish={submit} submiting={submiting} />
      </Page>
    </>
  );
}

export default MenuCreate;
