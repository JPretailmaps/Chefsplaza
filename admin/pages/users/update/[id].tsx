import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Tabs, message } from 'antd';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/user/account-form';
import { IUser } from 'src/interfaces';
import { authService, userService } from '@services/index';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import Loader from '@components/common/base/loader';
import { showError } from '@lib/message';

interface IProps {
  id: string;
}

function UserUpdate({ id }: IProps) {
  const [pwUpdating, setPwUpdating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [user, setUser] = useState({} as IUser);

  const getUser = async () => {
    try {
      setFetching(true);
      const resp = await userService.findById(id);
      setUser(resp.data);
    } catch (e) {
      message.error('Error while fecting user!');
    } finally {
      setFetching(false);
    }
  };

  const onAvatarUploaded = () => {
    // TODO - check with current user if needed?
    message.success('Avatar has been updated!');
    // this.props.updateCurrentUserAvatar(data.base64);
  };

  const submit = async (data: any) => {
    try {
      setUpdating(true);
      const updated = await userService.update(id, data);
      setUser(updated.data);
      message.success('Updated successfully');
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async (data: any) => {
    try {
      setPwUpdating(true);

      await authService.updatePassword(data.password, id, 'user');
      message.success('Password has been updated!');
    } catch (e) {
      showError(e);
    } finally {
      setPwUpdating(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const uploadHeaders = {
    authorization: authService.getToken()
  };

  return (
    <>
      <Head>
        <title>User update</title>
      </Head>
      <Page>
        {fetching ? (
          <Loader />
        ) : (
          <Tabs defaultActiveKey="basic" tabPosition="top">
            <Tabs.TabPane tab={<span>Basic information</span>} key="basic">
              <AccountForm
                onFinish={submit}
                user={user}
                updating={updating}
                options={{
                  uploadHeaders,
                  avatarUploadUrl: userService.getAvatarUploadUrl(user._id),
                  onAvatarUploaded: onAvatarUploaded.bind(this),
                  avatarUrl: user?.avatar
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>Change password</span>} key="password">
              <UpdatePaswordForm onFinish={updatePassword} updating={pwUpdating} />
            </Tabs.TabPane>
          </Tabs>
        )}
      </Page>
    </>
  );
}

UserUpdate.getInitialProps = async (ctx) => ({
  ...ctx.query
});

export default UserUpdate;
