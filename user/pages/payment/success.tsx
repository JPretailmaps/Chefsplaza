import { HistoryOutlined } from '@ant-design/icons';
import SeoMetaHead from '@components/common/seo-meta-head';
import { Button, Result } from 'antd';
import Router from 'next/router';
import { connect } from 'react-redux';
import { HomeIcon } from 'src/icons';
import { IUser } from 'src/interfaces';

interface IProps {
  user: IUser;
}

function PaymentSuccess(props: IProps) {
  const { user } = props;

  return (
    <>
      <SeoMetaHead pageTitle="Payment successful" />
      <div className="main-container">
        <Result
          status="success"
          title="Payment Successful"
          subTitle={`Hi ${user?.name || user?.username || 'there'}, your payment has been successfully processed`}
          extra={[
            <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
              <HomeIcon />
              BACK HOME
            </Button>,
            <Button key="buy" className="primary" onClick={() => Router.push('/user/payment-history')}>
              <HistoryOutlined />
              PAYMENT HISTORY
            </Button>
          ]}
        />
      </div>
    </>
  );
}

PaymentSuccess.authenticate = true;
PaymentSuccess.noredirect = true;

const mapStates = (state: any) => ({
  user: state.user.current
});

const mapDispatch = { };
export default connect(mapStates, mapDispatch)(PaymentSuccess);
