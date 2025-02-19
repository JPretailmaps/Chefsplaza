import {
  ContactsOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Button, Result } from 'antd';
import Router from 'next/router';

export default function Custom404() {
  return (
    <Result
      status="404"
      title="404"
      subTitle={'Sorry, we can\'t find this page'}
      extra={[
        <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
          <HomeOutlined />
          BACK HOME
        </Button>,
        <Button key="buy" className="primary" onClick={() => Router.push('/contact')}>
          <ContactsOutlined />
          CONTACT US
        </Button>
      ]}
    />
  );
}
