import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/performer/AccountForm';
import { showError } from '@lib/message';
import { performerCategoryService, performerService } from '@services/index';
import { utilsService } from '@services/utils.service';
import { Layout, message } from 'antd';
import Head from 'next/head';
import Router from 'next/router';
import { useRef, useState } from 'react';
import {
  IPerformerCategory
} from 'src/interfaces';

interface IProps {
  categories: IPerformerCategory[];
}

function PerformerCreate({
  categories
}: IProps) {
  const [creating, setCreating] = useState(false);
  const _avatar = useRef(null);
  const _cover = useRef(null);

  const onBeforeUpload = async (file: File, field = 'avatar') => {
    if (field === 'avatar') {
      _avatar.current = file;
    }
    if (field === 'cover') {
      _cover.current = file;
    }
  };

  const submit = async (data: any) => {
    try {
      if (data.password !== data.rePassword) {
        message.error('Confirm password mismatch!');
        return;
      }

      setCreating(true);
      const resp = await performerService.create({
        ...data
      });
      if (_avatar.current) {
        await performerService.uploadAvatar(_avatar.current, resp.data._id);
      }
      if (_cover.current) {
        await performerService.uploadCover(_cover.current, resp.data._id);
      }
      message.success('Created successfully');
      Router.push(
        {
          pathname: '/creator',
          query: { id: resp.data._id }
        }
      );
    } catch (e) {
      showError(e);
      setCreating(false);
    }
  };
  return (
    <>
      <Head>
        <title>New Creator</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[{ title: 'Creators', href: '/creator' }, { title: 'New creator' }]}
      />
      <Page>
        <AccountForm
          onFinish={submit}
          submiting={creating}
          categories={categories}
          onBeforeUpload={onBeforeUpload}
        />
      </Page>
    </>
  );
}

PerformerCreate.getInitialProps = async () => {
  const [countries, categories, languages, phoneCodes, bodyInfo] = await Promise.all([
    utilsService.countriesList(),
    performerCategoryService.search(),
    utilsService.languagesList(),
    utilsService.phoneCodesList(),
    utilsService.bodyInfo()
  ]);
  return {
    countries: countries?.data || [],
    categories: categories?.data.data || [],
    languages: languages?.data || [],
    phoneCodes: phoneCodes?.data || [],
    bodyInfo: bodyInfo?.data
  };
};

export default PerformerCreate;
