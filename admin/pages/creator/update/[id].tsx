import { BreadcrumbComponent } from '@components/common';
import Loader from '@components/common/base/loader';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/performer/AccountForm';
import { BankingForm } from '@components/performer/BankingForm';
import { PerformerDocument } from '@components/performer/Document';
import { SubscriptionForm } from '@components/performer/Subcription';
import { CommissionSettingForm } from '@components/performer/commission-setting';
import { PerformerPaypalForm } from '@components/performer/paypalForm';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { authService, performerCategoryService, performerService } from '@services/index';
import { utilsService } from '@services/utils.service';
import { Tabs, message } from 'antd';
import { omit } from 'lodash';
import Head from 'next/head';
import {
  useEffect, useState
} from 'react';
import {
  IPerformer,
  IPerformerCategory
} from 'src/interfaces';

interface IProps {
  id: string;
  categories: IPerformerCategory[];
}
function PerformerUpdate({
  id, categories
}: IProps) {
  const [pwUpdating, setPwUpdating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [performer, setPerformer] = useState({} as IPerformer);
  const [settingUpdating, setSettingUpdating] = useState(false);

  const getPerformer = async () => {
    try {
      setFetching(true);
      const resp = await (await performerService.findById(id)).data as IPerformer;
      setPerformer(resp);
    } catch (e) {
      message.error('Error while fecting performer!');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getPerformer();
  }, []);

  const updatePassword = async (data: any) => {
    try {
      setPwUpdating(true);
      await authService.updatePassword(data.password, id, 'performer');
      message.success('Password has been updated!');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setPwUpdating(false);
    }
  };

  const updatePaymentGatewaySetting = async (key: string, data: any) => {
    try {
      setSettingUpdating(true);
      await performerService.updatePaymentGatewaySetting(id, {
        performerId: id,
        key: key || 'ccbill',
        status: 'active',
        value: data
      });
      message.success('Updated successfully!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setSettingUpdating(false);
    }
  };

  const updateCommissionSetting = async (data: any) => {
    try {
      setSettingUpdating(true);
      await performerService.updateCommissionSetting(id, { ...data, performerId: id });
      message.success('Updated commission setting successfully!');
    } catch (error) {
      const err = await error;
      message.error(err?.message || 'An error occurred, please try again!');
    } finally {
      setSettingUpdating(false);
    }
  };

  const updateBankingSetting = async (data: any) => {
    try {
      setSettingUpdating(true);
      await performerService.updateBankingSetting(id, { ...data, performerId: id });
      message.success('Updated successfully!');
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      setSettingUpdating(false);
    }
  };

  const submit = async (data: any) => {
    let newData = data;
    try {
      if (data.status === 'pending-email-confirmation') {
        newData = omit(data, ['status']);
      }
      setUpdating(true);
      const updated = await performerService.update(id, {
        ...omit(performer, ['welcomeVideoId', 'welcomeVideoName', 'welcomeVideoPath']),
        ...newData
      });
      setPerformer(updated.data);
      message.success('Updated successfully');
    } catch (e) {
      // TODO - exact error message
      const error = await e;
      message.error(error && (error.message || 'An error occurred, please try again!'));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Creator update</title>
      </Head>
      <BreadcrumbComponent
        breadcrumbs={[
          { title: 'Creators', href: '/creator' },
          { title: performer?.name || performer?.username || '' },
          { title: 'Update' }
        ]}
      />
      <Page>
        {fetching ? (
          <Loader />
        ) : (
          <Tabs defaultActiveKey="basic" tabPosition="top">
            <Tabs.TabPane tab={<span>Basic Settings</span>} key="basic">
              <AccountForm
                onFinish={submit}
                performer={performer}
                submiting={updating}
                categories={categories}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>ID Documents</span>} key="document">
              <PerformerDocument
                submitting={updating}
                onFinish={submit}
                performer={performer}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>Pricing</span>} key="subscription">
              <SubscriptionForm
                submitting={updating}
                onFinish={submit}
                performer={performer}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>Commission</span>} key="commission">
              <CommissionSettingForm
                submitting={settingUpdating}
                onFinish={updateCommissionSetting}
                performer={performer}
              />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab={<span>CCbill</span>} key="ccbill">
                <CCbillSettingForm
                  submitting={settingUpdating}
                  onFinish={this.updatePaymentGatewaySetting.bind(this, 'ccbill')}
                  ccillSetting={performer.ccbillSetting}
                />
              </Tabs.TabPane> */}
            <Tabs.TabPane tab={<span>Banking</span>} key="banking">
              <BankingForm
                submitting={settingUpdating}
                onFinish={updateBankingSetting}
                bankingInformation={performer.bankingInformation || null}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<span>Paypal</span>} key="paypal">
              <PerformerPaypalForm
                updating={settingUpdating}
                onFinish={updatePaymentGatewaySetting.bind(this, 'paypal')}
                user={performer}
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

PerformerUpdate.getInitialProps = async (ctx) => {
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
    bodyInfo: bodyInfo?.data,
    ...ctx.query
  };
};

export default PerformerUpdate;
