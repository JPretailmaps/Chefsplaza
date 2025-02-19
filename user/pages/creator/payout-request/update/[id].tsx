import { NotificationOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import PayoutRequestForm from '@components/payout-request/form';
import { message } from 'antd';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import React, { useEffect, useState } from 'react';
import {
  PayoutRequestInterface
} from 'src/interfaces';
import { payoutRequestService } from 'src/services';
import SeoMetaHead from '@components/common/seo-meta-head';
import { NextPageContext } from 'next/types';
import { showError } from '@lib/utils';

interface IProps {
  payout: PayoutRequestInterface;
}

function PayoutRequestUpdatePage({ payout }: IProps) {
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
    if (!payout) {
      message.error('Could not find payout request');
      Router.back();
    }
    calculateStatsPayout();
  }, []);

  const submit = async (data: {
    paymentAccountType: string;
    requestNote: string;
    requestTokens: number;
  }) => {
    if (['done', 'approved', 'rejected'].includes(payout.status)) {
      message.error('Please recheck request payout status');
      return;
    }
    try {
      setsubmiting(true);
      const body = {
        paymentAccountType: data.paymentAccountType,
        requestTokens: data.requestTokens,
        requestNote: data.requestNote,
        source: 'performer'
      };
      await payoutRequestService.update(payout._id, body);
      message.success('Changes saved!');
      Router.push('/creator/payout-request');
    } catch (e) {
      showError(e);
      setsubmiting(false);
    }
  };

  return (
    <>
      <SeoMetaHead pageTitle="Edit Payout Request" />
      <div className="main-container">
        <PageHeading title="Edit Payout Request" icon={<NotificationOutlined />} />
        <PayoutRequestForm
          statsPayout={statsPayout}
          payout={payout}
          submit={submit}
          submiting={submiting}
        />
      </div>
    </>
  );
}

PayoutRequestUpdatePage.authenticate = true;

PayoutRequestUpdatePage.onlyPerformer = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const resp = await payoutRequestService.detail(`${ctx.query.id}`, {
      Authorization: token
    });
    return {
      props: { payout: resp.data }
    };
  } catch {
    return { notFound: true };
  }
};

export default PayoutRequestUpdatePage;
