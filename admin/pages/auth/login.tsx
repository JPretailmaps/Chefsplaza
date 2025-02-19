import {
  Form, Input, Button, Layout
} from 'antd';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { login } from '@redux/auth/actions';
import Link from 'next/link';
import getConfig from 'next/config';
import { IUIConfig } from 'src/interfaces';
import { showError } from '@lib/message';
import dynamic from 'next/dynamic';
import style from './auth.module.scss';

const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

const FormItem = Form.Item;

interface IProps {
  loginAuth: any;
  ui: IUIConfig;
  login: Function;
}

function Login({ login: handlerLogin, loginAuth, ui }: IProps) {
  useEffect(() => {
    const { error } = loginAuth;
    if (error) {
      showError(error);
    }
  }, [loginAuth]);

  const { requesting } = loginAuth;

  const { publicRuntimeConfig: config } = getConfig();

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>
      <div className={style['form-body']}>
        <div className={style.form}>
          <div className={style.logo}>
            <Logo />
            <h2>Admin Panel</h2>
          </div>
          <Form
            onFinish={(values) => handlerLogin(values)}
            initialValues={{
              username: '',
              password: ''
            }}
          >
            <FormItem
              name="username"
              rules={[
                { required: true, message: 'Email or Username is missing' }
              ]}
            >
              <Input
                autoFocus
                disabled={requesting}
                placeholder="Email/Username"
              />
            </FormItem>
            <FormItem
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password
                disabled={requesting}
                placeholder="Password"
              />
            </FormItem>
            <FormItem>
              <Button
                block
                type="primary"
                loading={requesting}
                disabled={requesting}
                htmlType="submit"
              >
                LOG IN
              </Button>
            </FormItem>
          </Form>
          <p>
            <Link href="/auth/forgot">
              Forgot password?
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

Login.layout = 'public';
Login.noAuthenticate = true;

const mapStates = (state: any) => ({
  loginAuth: state.auth.loginAuth,
  ui: state.ui
});

const mapDispatch = { login };
export default connect(mapStates, mapDispatch)(Login);
