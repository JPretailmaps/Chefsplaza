import { HomeOutlined, PhoneOutlined } from '@ant-design/icons';
import SeoMetaHead from '@components/common/seo-meta-head';
import { Button, Result } from 'antd';
import Router from 'next/router';
import { useSelector } from 'react-redux';

function PaymentCancel() {
  const user = useSelector((state: any) => state.user.current);

  return (
    <>
      <SeoMetaHead pageTitle="Payment fail" />
      <div className="main-container">
        <Result
          status="error"
          title="Payment Fail"
          subTitle={`Hi ${user?.name || user?.username || 'there'}, your payment has been fail. Please contact us for more information.`}
          extra={[
            <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
              <HomeOutlined />
              BACK HOME
            </Button>,
            <Button key="buy" className="primary" onClick={() => Router.push('/contact')}>
              <PhoneOutlined />
              CONTACT US
            </Button>
          ]}
        />
      </div>
    </>
  );
}

export default PaymentCancel;
