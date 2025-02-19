import Head from 'next/head';
import { useEffect, useState } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { menuService } from '@services/menu.service';
import { IMenu } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';
import { FormMenu } from '@components/menu/form-menu';

interface IProps {
  id: string;
}

function MenuUpdate({ id }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [menu, setMenu] = useState({} as IMenu);

  const submit = (data: any) => {
    try {
      const submitData = {
        ...data
      };

      menuService.update(id, submitData);
      message.success('Updated successfully');
      setSubmiting(false);
    } catch (e) {
      message.error('Something went wrong, please try again!');
      setSubmiting(false);
    }
  };

  const updateMenu = async () => {
    try {
      const resp = await menuService.findById(id);
      setMenu(resp.data);
    } catch (e) {
      message.error('Menu not found!');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    updateMenu();
  }, []);

  return (
    <>
      <Head>
        <title>Update Menu</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[{ title: 'Menu', href: '/menu' }, { title: menu.title ? menu.title : 'Detail menu' }]}
      />
      <Page>
        {fetching ? <Loader /> : <FormMenu menu={menu} onFinish={submit} submiting={submiting} />}
      </Page>
    </>
  );
}

MenuUpdate.getInitialProps = (ctx) => ctx.query;

export default MenuUpdate;
