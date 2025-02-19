import Head from 'next/head';
import { useRef, useState } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import Router from 'next/router';
import { userService } from '@services/index';
import { validateUsername } from '@lib/utils';
import { AccountForm } from '@components/user/account-form';
import { showError } from '@lib/message';

function UserCreate() {
  const [creating, setCreating] = useState(false);
  const _avatar = useRef(null);

  const onBeforeUpload = (file) => {
    _avatar.current = file;
  };

  const submit = async (data: any) => {
    try {
      if (data.password !== data.rePassword) {
        message.error('Confirm password is mismatched!');
        return;
      }

      if (!validateUsername(data.username)) {
        message.error('Username must contain only alphanumerics');
        return;
      }

      setCreating(true);
      const resp = await userService.create(data);
      if (_avatar.current) {
        await userService.uploadAvatarUser(_avatar.current, resp.data._id);
      }
      message.success('Created successfully');
      Router.push(
        {
          pathname: '/users'
        },
        '/users'
      );
    } catch (e) {
      showError(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Head>
        <title>New User</title>
      </Head>
      <Page>
        <AccountForm
          onFinish={submit.bind(this)}
          updating={creating}
          options={{
            beforeUpload: onBeforeUpload.bind(this)
          }}
        />
      </Page>
    </>
  );
}

export default UserCreate;
