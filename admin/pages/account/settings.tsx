import Page from '@components/common/layout/page';
import { AccountForm } from '@components/user/account-form';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { authService, userService } from '@services/index';
import { Tabs, message } from 'antd';
import Head from 'next/head';
import {
  useEffect, useState
} from 'react';
import { connect } from 'react-redux';
import { IUser } from 'src/interfaces';
import { updateCurrentUserAvatar, updateUser } from 'src/redux/user/actions';

interface IProps {
  currentUser: IUser;
  updateUser: Function;
  updating: boolean;
  updateCurrentUserAvatar: Function;
  updateSuccess: boolean;
}
function AccountSettings(props: IProps) {
  const {
    currentUser,
    updateUser: handleUpdate,
    updateCurrentUserAvatar: handleUpdateAvatar,
    updating,
    updateSuccess
  } = props;
  const [pwUpdating, setPwUpdating] = useState(false);

  useEffect(() => {
    if (updateSuccess) {
      message.success('Updated successfully!');
    }
  }, [updateSuccess]);

  const onAvatarUploaded = (data) => {
    message.success('Avatar has been updated!');
    handleUpdateAvatar(data.base64);
  };

  const submit = (data) => {
    handleUpdate(data);
  };

  const updatePassword = async (data) => {
    try {
      setPwUpdating(true);
      await authService.updatePassword(data.password);
      message.success('Password has been updated!');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setPwUpdating(false);
    }
  };

  const uploadHeaders = { authorization: authService.getToken() };

  return (
    <>
      <Head>
        <title>Account Settings</title>
      </Head>
      <Page>
        <Tabs defaultActiveKey="basic" tabPosition="top">
          <Tabs.TabPane tab={<span>Basic info</span>} key="basic">
            <AccountForm
              onFinish={submit}
              user={currentUser}
              updating={updating}
              options={{
                uploadHeaders,
                avatarUploadUrl: userService.getAvatarUploadUrl(),
                onAvatarUploaded: (d) => onAvatarUploaded(d),
                avatarUrl: currentUser.avatar
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span>Change password</span>} key="password">
            <UpdatePaswordForm
              onFinish={updatePassword.bind(this)}
              updating={pwUpdating}
            />
          </Tabs.TabPane>
        </Tabs>
      </Page>
    </>
  );
}

const mapStates = (state: any) => ({
  currentUser: state.user.current,
  updating: state.user.updating,
  updateSuccess: state.user.updateSuccess
});

const mapDispatch = { updateUser, updateCurrentUserAvatar };
export default connect(mapStates, mapDispatch)(AccountSettings);
