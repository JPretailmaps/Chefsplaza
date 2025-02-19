/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  message, Select, Button,
  Input, Space, Statistic, Divider, Avatar
} from 'antd';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ICountry, IPayoutRequest } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { payoutRequestService, utilsService } from 'src/services';
import Router from 'next/router';
import { formatDate } from 'src/lib/date';
import nextCookie from 'next-cookies';
import { showError } from '@lib/message';
import style from './detail.module.scss';

interface IProps {
  request: IPayoutRequest;
  countries: ICountry[]
}

function PayoutDetailPage({
  request, countries
}: IProps) {
  const [status, setStatus] = useState(request.status);
  const [adminNote, setNote] = useState(request.adminNote);
  const [submiting, setSubmiting] = useState(false);
  const [statsPayout, setStats] = useState({
    totalEarnedTokens: 0,
    previousPaidOutTokens: 0,
    remainingUnpaidTokens: 0
  });

  const onUpdate = async () => {
    try {
      setSubmiting(true);
      await payoutRequestService.update(request._id, {
        status,
        adminNote
      });
      message.success('Updated successfully');
      Router.replace('/payout-request');
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const getStatsPayout = async (performerId: string) => {
    try {
      const resp = await payoutRequestService.calculate({
        performerId
      });
      setStats(resp.data);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    getStatsPayout(request.sourceId);
  }, [request]);

  const { paymentAccountInfo } = request;
  const country = countries && countries.find((c) => c.code === paymentAccountInfo?.country);
  return (
    <>
      <Head>
        <title>Payout Request Details</title>
      </Head>
      <div className="main-container">
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Payout Requests', href: '/payout-request' },
            {
              title: 'Payout Request Details'
            }
          ]}
        />
        <Page>
          <h1 style={{ marginTop: '0' }}>Payout Request Details</h1>
          <div style={{ margin: '20px 0', textAlign: 'center', width: '100%' }} className={style['payout-stats']}>
            <Space size="large">
              <Statistic
                prefix="$"
                title="Total Price"
                value={statsPayout?.totalEarnedTokens || 0}
                precision={2}
              />
              <Statistic
                prefix="$"
                title="Paid Out Price"
                value={statsPayout?.previousPaidOutTokens || 0}
                precision={2}
              />
              <Statistic
                prefix="$"
                title="Remaining Price"
                value={statsPayout?.remainingUnpaidTokens || 0}
                precision={2}
              />
            </Space>
          </div>
          <Divider />
          <div className="item-list">
            <strong>Creator</strong>
            <div>
              :
              {' '}
              <Avatar src={request?.sourceInfo?.avatar || '/no-avatar.jpg'} />
              {' '}
              {request?.sourceInfo?.name || request?.sourceInfo?.username || 'N/A'}
            </div>
          </div>
          <div className="item-list">
            <strong>Requested amount</strong>
            <div>
              :
              {' '}
              $
              {(request.requestTokens || 0).toFixed(2)}
            </div>
          </div>
          <div className="item-list">
            <strong>Requested on</strong>
            <div>
              :
              {' '}
              {formatDate(request.createdAt)}
            </div>
          </div>
          <div className="item-list">
            <strong>Note from the creator</strong>
            <div>
              :
              {' '}
              {request.requestNote}
            </div>
          </div>
          {request.paymentAccountType === 'paypal' && (
            <div>
              <h2>Paypal Transfer</h2>
              <div className="item-list">
                <strong>Paypal Account</strong>
                <div>
                  :
                  {' '}
                  {paymentAccountInfo?.value?.email || 'N/A'}
                </div>
              </div>
              <div className="item-list">
                <strong>Amount</strong>
                <div>
                  : $
                  {(request.requestTokens || 0).toFixed(2)}
                </div>
              </div>
              {/* <form action={config.PAYPAY_PAYOUT_URL || 'https://www.paypal.com/cgi-bin/webscr'} method="post" className={style['paypal-payout']}>
                  <input type="hidden" name="cmd" value="_xclick" />
                  <input type="hidden" name="return" value={window.location.href} />
                  <input type="hidden" name="cancel_return" value={window.location.href} />
                  <input type="hidden" name="business" value={paymentAccountInfo?.value?.email} />
                  <input type="hidden" name="item_number" value={request._id} />
                  <input type="hidden" name="item_name" value={`Payout to ${request?.sourceInfo?.name || request?.sourceInfo?.username || `${request?.sourceInfo?.firstname} ${request?.sourceInfo?.lastName}`}`} placeholder="Description" />
                  <input type="hidden" name="currency_code" value="USD" />
                  <input type="hidden" name="amount" value={(request.requestTokens || 0) * (request.tokenConversionRate || 1)} />
                  <input disabled={request?.status !== 'pending'} type="image" src="/paypal-pay-btn.png" name="submit" alt="PayPal" style={{ width: 180 }} />
                </form> */}
            </div>
          )}
          {request.paymentAccountType === 'banking' && (
            <div>
              <h2>
                Bank Transfer
              </h2>
              <div className="item-list">
                <strong>Bank name</strong>
                <div>
                  :
                  {' '}
                  {paymentAccountInfo?.bankName || 'N/A'}
                </div>
              </div>
              <div className="item-list">
                <strong>Bank account number</strong>
                <div>
                  :
                  {' '}
                  {paymentAccountInfo?.bankAccount || 'N/A'}
                </div>
              </div>
              <div className="item-list">
                <strong>Bank account</strong>
                <div>
                  :
                  {' '}
                  {`${paymentAccountInfo?.firstName} ${paymentAccountInfo?.lastName}`}
                </div>
              </div>
              <div className="item-list">
                <strong>Bank routing</strong>
                <div>
                  :
                  {' '}
                  {paymentAccountInfo?.bankRouting || 'N/A'}
                </div>
              </div>
              <div className="item-list">
                <strong>Bank swift code</strong>
                <div>
                  :
                  {' '}
                  {paymentAccountInfo?.bankSwiftCode || 'N/A'}
                </div>
              </div>
              <div className="item-list">
                <strong>Country</strong>
                <div>
                  :
                  {' '}
                  {paymentAccountInfo?.country ? (
                    <span>
                      <img src={country?.flag} alt="flag" width="20px" style={{ verticalAlign: 'middle' }} />
                      {' '}
                      {country?.name}
                    </span>
                  ) : 'N/A'}
                </div>
              </div>
            </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <p style={{ color: 'red' }}>
              Please update the below status manually after the transaction is processed
            </p>
            <Select
              disabled={['done', 'rejected'].includes(request?.status)}
              style={{ width: '100%' }}
              onChange={(e) => setStatus(e)}
              value={status}
            >
              {/* <Select.Option key="approved" value="approved">
                          Approved
                        </Select.Option> */}
              <Select.Option key="pending" value="pending">
                Pending
              </Select.Option>
              <Select.Option key="rejected" value="rejected">
                Rejected
              </Select.Option>
              <Select.Option key="done" value="done">
                Done
              </Select.Option>
            </Select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <p>Note to the creator: </p>
            <Input.TextArea
              defaultValue={adminNote}
              style={{ width: '100%' }}
              onChange={(v) => setNote(v.target.value)}
              placeholder="Write your message here"
              autoSize={{ minRows: 3 }}
            />
          </div>
          <div className="item-list-button">
            <Button
              disabled={submiting}
              loading={submiting}
              type="primary"
              onClick={onUpdate}
            >
              Update
            </Button>
            &nbsp;
            <Button
              type="default"
              onClick={() => Router.back()}
            >
              Back
            </Button>
          </div>
        </Page>
      </div>

    </>
  );
}

PayoutDetailPage.getInitialProps = async (ctx) => {
  const { token } = nextCookie(ctx);
  const { id } = ctx.query;
  const [payout, countries] = await Promise.all([
    payoutRequestService.findById(id, {
      Authorization: token || ''
    }),
    utilsService.countriesList()
  ]);
  return {
    request: payout.data,
    countries: countries?.data || []
  };
};

export default PayoutDetailPage;
