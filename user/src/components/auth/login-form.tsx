import { login } from '@redux/auth/actions';
import {
  Button, Divider, Form, Input
} from 'antd';
import Link from 'next/link';
import { connect, ConnectedProps } from 'react-redux';

import style from './login-form.module.scss';

const mapStatesToProps = (state: any) => ({
  loginAuth: { ...state.auth.loginAuth },
  siteName: state.ui.siteName
});

const mapDispatchToProps = {
  handleLogin: login
};

const connector = connect(mapStatesToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

// TODO - refactor me

function LoginForm({
  loginAuth,
  siteName,
  handleLogin
}: PropsFromRedux) {
  return (
    <div className={style['login-form']}>
      <Form
        name="normal_login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
      >
        <p className={style['text-login']}>LOG IN</p>
        <Form.Item
          name="username"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: 'Email/Username is missing' }]}
        >
          <Input className={style['login-input']} disabled={loginAuth.requesting} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password className={style['login-input']} disabled={loginAuth.requesting} placeholder="Password" />
        </Form.Item>
        <Button
          disabled={loginAuth.requesting}
          loading={loginAuth.requesting}
          htmlType="submit"
          className={style['form-button']}
        >
          LOG IN
        </Button>
        <div className={style['login-content-signup']}>
          <p style={{ padding: '0 20px' }}>
            <Link
              href={{
                pathname: '/auth/forgot-password'
              }}
              className={style['sub-text']}
            >
              <span style={{ color: '#7CFC00', fontWeight: 'bolder', fontSize: '15px' }}>Forgot password?</span>
            </Link>
          </p>
          <p>
            <Link href="/auth/register">
              <span style={{ color: '#7CFC00', fontWeight: 'bolder', fontSize: '15px' }}>{`Sign up for ${siteName}`}</span>
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default connector(LoginForm);
