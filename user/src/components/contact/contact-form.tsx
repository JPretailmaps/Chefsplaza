import { showError } from '@lib/utils';
import { settingService } from '@services/setting.service';
import {
  Button, Form, Input, message,
  Skeleton
} from 'antd';
import { useState } from 'react';
import useCountdown from 'src/hooks/use-countdown';
import useSettings from 'src/hooks/use-settings';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '@components/common/base/logo';
import { IUser } from '@interfaces/user';
import { useSelector } from 'react-redux';
import style from './contact.module.scss';

const { TextArea } = Input;

function ContactForm() {
  const { loading, data: settings } = useSettings(['loginPlaceholderImage']);
  const user: IUser = useSelector((state: any) => state.user.current);
  const [submiting, setsubmiting] = useState(false);

  const numCountdown = 60;
  const { countTime, setCountdown } = useCountdown();

  const onFinish = async (values) => {
    try {
      setsubmiting(true);
      await settingService.contact(values);
      message.success('Thank you for contact us, we will reply within 48hrs.');
      setCountdown(numCountdown);
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <div className="main-container">
      <div className={style['contact-box']}>
        <div className={`${style['content-left']}`}>
          {loading ? <Skeleton.Image /> : (
            <Image
              alt="welcome-placeholder"
              fill
              priority
              quality={70}
              sizes="(max-width: 768px) 100vw, (max-width: 2100px) 40vw"
              src={settings.loginPlaceholderImage || '/auth-img.png'}
            />
          )}
        </div>
        <div className={`${style['content-right']}`}>
          <div className={style['contact-form']}>
            <div className={style.logo}>
              <Logo />
            </div>
            <h1 className={style.title}>
              Contact Us
            </h1>
            <p className="text-center">
              Please fill out the form below and we will get back to you as soon as possible
            </p>
            <Form
              layout="vertical"
              name="contact-from"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Tell us your full name' }]}
              >
                <Input placeholder="Full name" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Tell us your email address.'
                  },
                  { type: 'email', message: 'Invalid email format' }
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
              <Form.Item
                name="message"
                rules={[
                  { required: true, message: 'What can we help you?' },
                  {
                    min: 20,
                    message: 'Please input at least 20 characters.'
                  }
                ]}
              >
                <TextArea rows={6} placeholder="Message" />
              </Form.Item>
              <div className="text-center">
                <Button
                  size="large"
                  className={style['form-button']}
                  type="primary"
                  htmlType="submit"
                  loading={submiting || countTime > 0}
                  disabled={submiting || countTime > 0}
                  style={{ fontWeight: 600, width: '100%' }}
                >
                  {countTime > 0 ? 'RESEND IN' : 'SEND'}
                  {' '}
                  {countTime > 0 && `${countTime}s`}
                </Button>
              </div>
            </Form>
            <div className="text-center">
              {!user?._id && (
              <p>
                Have an account already?
                &nbsp;
                <Link href="/auth/login">
                  Log in here.
                </Link>
              </p>
              )}
              {(!user?._id || !user?.isPerformer) && (
              <p>
                Are you a creator?
                &nbsp;
                <Link href="/auth/creator-register">
                  Sign up here.
                </Link>
              </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
