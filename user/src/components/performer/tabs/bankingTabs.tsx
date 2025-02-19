import { skeletonLoading } from '@lib/loading';
import { showError } from '@lib/utils';
import { performerService } from '@services/index';
import { message, Tabs } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { connect } from 'react-redux';
import {
  IPerformer
} from 'src/interfaces';
import {
  updateUserSuccess
} from 'src/redux/user/actions';

const PerformerBankingForm = dynamic(() => import('@components/performer/management-form/banking-form'), { ssr: false, loading: skeletonLoading });
const PerformerPaypalForm = dynamic(() => import('@components/performer/management-form/paypalForm'), { ssr: false, loading: skeletonLoading });

interface IProps {
  user: IPerformer;
  updateUserSuccess: Function;
}
function BankingSettingsTabs({ user, updateUserSuccess: onUpdateSuccess }: IProps) {
  const [submiting, setsubmiting] = useState(false);

  const handleUpdatePaypal = async (data) => {
    try {
      setsubmiting(true);
      const payload = { key: 'paypal', value: data, performerId: user._id };
      const resp = await performerService.updatePaymentGateway(user._id, payload);
      onUpdateSuccess({ ...user, paypalSetting: resp.data });
      message.success('Paypal account was updated successfully!');
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const handleUpdateBanking = async (data) => {
    try {
      setsubmiting(true);
      const info = { ...data, performerId: user._id };
      const resp = await performerService.updateBanking(user._id, info);
      onUpdateSuccess({ ...user, bankingInformation: resp.data });
      message.success('Banking account was updated successfully!');
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <Tabs>
      <Tabs.TabPane
        tab={(
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image
              src="/banking-ico.png"
              alt="banking-icon"
              height={40}
              width={50}
              quality={30}
              priority
              style={{ height: 40, width: 'auto' }}
            />
            &nbsp;
            Bank Transfer
          </div>
        )}
        key="banking"
      >
        <PerformerBankingForm
          onFinish={(data) => handleUpdateBanking(data)}
          updating={submiting}
          user={user}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={(
          <Image
            src="/paypal-ico.png"
            alt="paypal-icon"
            height={40}
            width={50}
            quality={30}
            priority
            style={{ height: 40, width: 'auto' }}
          />
        )}
        key="paypal"
      >
        <PerformerPaypalForm
          onFinish={(data) => handleUpdatePaypal(data)}
          updating={submiting}
          user={user}
        />
      </Tabs.TabPane>
    </Tabs>
  );
}

const mapStates = (state: any) => ({
  user: state.user.current
});

const mapDispatch = { updateUserSuccess };

export default connect(mapStates, mapDispatch)(BankingSettingsTabs);
