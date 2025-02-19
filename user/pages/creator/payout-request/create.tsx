import { NotificationOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import PayoutRequestForm from '@components/payout-request/form';
import { showError } from '@lib/utils';
import { Spin, message } from 'antd';
import Router from 'next/router';
import { NextPageContext } from 'next/types';
import { useEffect, useState } from 'react';
import { payoutRequestService } from 'src/services';
import nextCookie from 'next-cookies';

interface IProps {
  valid: boolean
}
function PayoutRequestCreatePage({ valid }: IProps) {
  const [submiting, setsubmiting] = useState(false);
  const [statsPayout, setStatsPayout] = useState({
    totalEarnedTokens: 0,
    previousPaidOutTokens: 0,
    remainingUnpaidTokens: 0
  });

  const calculateStatsPayout = async () => {
    const resp = await payoutRequestService.calculate();
    resp?.data && setStatsPayout(resp.data);
  };

  useEffect(() => {
    if (!valid) {
      message.error('Your previous request is pending. Please wait before requesting new payout', 5);
      Router.back();
    } else {
      calculateStatsPayout();
    }
  }, []);

  const submit = async (data) => {
    try {
      setsubmiting(true);
      const body = { ...data, source: 'performer' };
      await payoutRequestService.create(body);
      message.success('Your payout request was sent!');
      Router.push('/creator/payout-request');
    } catch (e) {
      showError(e);
      setsubmiting(false);
    }
  };

  if (!valid) return <div style={{ margin: 50 }} className="text-center"><Spin /></div>;

  return (
    <>
      <SeoMetaHead pageTitle="New Payout Request" />
      <div className="main-container">
        <PageHeading title="New Payout Request" icon={<NotificationOutlined />} />
        <PayoutRequestForm
          payout={{
            requestNote: '',
            requestTokens: 1,
            status: 'pending'
          }}
          statsPayout={statsPayout}
          submit={submit}
          submiting={submiting}
        />
      </div>
    </>
  );
}

PayoutRequestCreatePage.authenticate = true;

PayoutRequestCreatePage.onlyPerformer = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const resp = await payoutRequestService.checkPending({
      Authorization: token || ''
    });
    return {
      props: { valid: resp.data }
    };
  } catch {
    return { notFound: true };
  }
};

export default PayoutRequestCreatePage;
