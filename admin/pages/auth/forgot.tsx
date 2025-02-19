import {
  Form, Input, Button, Row, message
} from 'antd';
import { useState } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { authService } from '@services/auth.service';
import Router from 'next/router';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import style from './auth.module.scss';

const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

const FormItem = Form.Item;

interface IProps {
  ui: any;
}

function ForgotPassword({ ui }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const { publicRuntimeConfig: config } = getConfig();

  const handleReset = async (data) => {
    try {
      setSubmitting(true);
      await authService.resetPassword({
        ...data
      });
      message.success('An email has been sent to you to reset your password');
      Router.push('/auth/login');
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Error occurred, please try again later');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot password</title>
      </Head>
      <div className={style['form-body']}>
        <div className={style.form}>
          <div className={style.logo}>
            <Logo />
            <h2>Forgot Password</h2>
          </div>
          <Form
            onFinish={(data) => handleReset(data)}
          >
            <FormItem
              hasFeedback
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email' }
              ]}
            >
              <Input
                placeholder="youremail@example.com"
              />
            </FormItem>
            <Row>
              <Button
                type="primary"
                loading={submitting}
                disabled={submitting}
                htmlType="submit"
              >
                Submit
              </Button>
            </Row>
          </Form>
          <p>
            <Link href="/auth/login">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className={style.footer}>
        {`Version ${config.BUILD_VERSION} - Copyright ${new Date().getFullYear()}`}
      </div>
    </>
  );
}

ForgotPassword.layout = 'public';
ForgotPassword.noAuthenticate = true;

const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(ForgotPassword);
