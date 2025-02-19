import { message, Tabs } from 'antd';
import { useEffect } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import {
  IPerformer
} from 'src/interfaces';
import {
  updateCurrentUserAvatar,
  updateCurrentUserCover,
  updatePerformer
} from 'src/redux/user/actions';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { IPerformerCategory } from '@interfaces/performer-category';
import { skeletonLoading } from '@lib/loading';
import style from './tabs.module.scss';

const PerformerAccountForm = dynamic(() => import('@components/performer/management-form/accountForm'));
const PerformerSubscriptionForm = dynamic(() => import('@components/performer/management-form/subscriptionForm'), { ssr: false, loading: skeletonLoading });
const PerformerVerificationForm = dynamic(() => import('@components/performer/management-form/verificationForm'), { ssr: false, loading: skeletonLoading });

interface IProps {
  currentUser: IPerformer;
  categories: IPerformerCategory[];
}

const mapStatesToProps = (state: any) => ({
  currentUser: state.user.current
});

const mapDispatchToProps = {
  handleUpdatePerformer: updatePerformer,
  handleUpdateAvt: updateCurrentUserAvatar,
  handleUpdateCover: updateCurrentUserCover
};

const connector = connect(mapStatesToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function AccountSettingsTabs({
  currentUser, categories
}: IProps & PropsFromRedux) {
  useEffect(() => {
    const { msg } = Router.query;
    if (msg) message.info(msg);
  }, []);

  const tabItems = [
    {
      key: 'basic',
      label: 'Basic Settings',
      children: <PerformerAccountForm
        user={currentUser}
        categories={categories}
      />
    },
    {
      key: 'verification',
      label: 'ID Documents',
      children: <PerformerVerificationForm
        user={currentUser}
      />
    },
    {
      key: 'subscription',
      label: 'Pricing Settings',
      children: <PerformerSubscriptionForm
        user={currentUser}
      />
    }
  ];
  return (
    <>
      {!currentUser.verifiedDocument && (
        <div className="verify-info">
          Your ID documents are not verified yet! You could not post any content right now.
          <p>
            If you have any question, please contact our administrator to get more information.
          </p>
        </div>
      )}
      <div className={style.account_tabs}>
        <Tabs items={tabItems} defaultActiveKey="basic" tabPosition="top" />
      </div>
    </>
  );
}

export default connector(AccountSettingsTabs);
