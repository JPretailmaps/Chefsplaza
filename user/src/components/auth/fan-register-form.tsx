import { showError } from '@lib/utils';
import { authService } from '@services/auth.service';
import {
  Button, Form, Input, message
} from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Image from 'next/image';
import classNames from 'classnames';
import style from './fan-register-form.module.scss';

const SocialLoginGroup = dynamic(() => import('@components/auth/social-login-group'));
type P = {
  loginPlaceholderImage: string;
}

function FanRegisterForm({ loginPlaceholderImage }: P) {
  const [requesting, setRequesting] = useState(false);
  const router = useRouter();

  const onRegister = async (values) => {
    try {
      setRequesting(true);
      const resp = (await authService.register(values)).data;
      message.success(resp?.message || 'Sign up success!', 10);
      router.push({
        pathname: '/auth/login',
        href: '/'
      });
      setRequesting(false);
    } catch (e) {
      showError(e);
      setRequesting(false);
    }
  };

  return (
    <div className="main-container">
      <p className="text-center">
        <small>
          Do not create an account on this page if you are a creator. Creators must create an account on
          {' '}
          <a href="/auth/creator-register">this link</a>
        </small>
      </p>
      <div className={classNames(style['register-box'])}>
        <div className={`${style['content-left']}`}>
          <Image
            alt="welcome-placeholder"
            fill
            quality={70}
            sizes="(max-width: 768px) 100vw, (max-width: 2100px) 50vw"
            src={loginPlaceholderImage || '/auth-img.png'}
          />
        </div>
        <div className={`${style['content-right']}`}>
          <div className={style.title}>Fan Sign Up</div>
          <p className="text-center">
            <small>Sign up to interact with your idols!</small>
          </p>
          <SocialLoginGroup />
          <div className={style['register-form']}>
            <Form
              labelCol={{ span: 24 }}
              name="member_register"
              initialValues={{ remember: true, gender: 'male' }}
              onFinish={onRegister}
              scrollToFirstError
            >
              <Form.Item
                name="firstName"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  { required: true, message: 'Please input your name!' },
                  {
                    pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                    message: 'First name can not contain number and special character'
                  }
                ]}
              >
                <Input placeholder="First name" />
              </Form.Item>
              <Form.Item
                name="lastName"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  { required: true, message: 'Please input your name!' },
                  {
                    pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                    message: 'Last name can not contain number and special character'
                  }
                ]}
              >
                <Input placeholder="Last name" />
              </Form.Item>
              <Form.Item
                name="username"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  { required: true, message: 'Please input your username!' },
                  {
                    pattern: /^[a-z0-9]+$/g,
                    message: 'Username must contain lowercase alphanumerics only'
                  },
                  { min: 3, message: 'Username must containt at least 3 characters' }
                ]}
              >
                <Input placeholder="User name: jonh123, smith,..." />
              </Form.Item>
              <Form.Item
                name="email"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    type: 'email',
                    message: 'Invalid email address!'
                  },
                  {
                    required: true,
                    message: 'Please input your email address!'
                  }
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
              <Form.Item
                name="password"
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                    message:
                      'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                  },
                  { required: true, message: 'Please enter your password!' }
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={style['form-button']}
                disabled={requesting}
                loading={requesting}
              >
                SIGN UP
              </Button>
            </Form>
            <div className="text-center">
              <p>
                By signing up you agree to our
                {' '}
                <Link href="/page/terms-of-service" target="_blank">
                  Terms of Service
                </Link>
                {' '}
                and
                {' '}
                <Link href="/page/privacy-policy" target="_blank">
                  Privacy Policy
                </Link>
                , and confirm that you are at least 18 years old.
              </p>
              <p>
                Have an account already?
                &nbsp;
                <Link href="/auth/login">
                  Log in here.
                </Link>
              </p>
              <p>
                Are you a creator?
                &nbsp;
                <Link href="/auth/creator-register">
                  Sign up here.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default FanRegisterForm;
