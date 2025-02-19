import { showError } from '@lib/utils';
import { authService } from '@services/index';
import {
  Button, Form, Input, message
} from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import useCountdown from 'src/hooks/use-countdown';
import { IForgot } from 'src/interfaces';
import Image from 'next/image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import style from './forgot-password-form.module.scss';

const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

type P = {
  loginPlaceholderImage: string
}

function ForgotPasswordForm({ loginPlaceholderImage }: P) {
  const [submiting, setsubmiting] = useState(false);

  const numCountdown = 60;
  const { countTime, setCountdown } = useCountdown();

  const handleReset = async (data: IForgot) => {
    try {
      setsubmiting(true);
      await authService.resetPassword({
        ...data
      });
      message.success('An email has been sent to you to reset your password');
      setCountdown(numCountdown);
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <div className={classNames(style['forgot-box'])}>
      <div className={`${style['content-left']}`}>
        <Image
          alt="welcome-placeholder"
          fill
          quality={70}
          sizes="(max-width: 768px) 100vw, (max-width: 2100px) 50vw"
          src={loginPlaceholderImage || '/auth-img.png'}
        />
      </div>
      <div className={style['content-right']}>
        <div className={style.logo}>
          <Logo />
        </div>
        <h3
          style={{
            fontSize: 30,
            textAlign: 'center'
          }}
        >
          Reset password
        </h3>
        <Form name="forgot-form" onFinish={handleReset}>
          <Form.Item
            name="email"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                type: 'email',
                message: 'Invalid email format'
              },
              {
                required: true,
                message: 'Please enter your E-mail!'
              }
            ]}
          >
            <Input className={style.input} placeholder="Enter your email address" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              className={style['form-button']}
              disabled={submiting || countTime > 0}
              loading={submiting || countTime > 0}
            >
              {countTime > 0 ? 'Resend in' : 'Send'}
                  &nbsp;
              {countTime > 0 && `${countTime}s`}
            </Button>

          </Form.Item>
        </Form>
        <div className="text-center">
          <p>
            Have an account already?
            &nbsp;
            <Link href="/auth/login">
              Log in here.
            </Link>
          </p>
          <p>
            Don&apos;t have an account yet?
            &nbsp;
            <Link href="/auth/register">
              Sign up here.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
