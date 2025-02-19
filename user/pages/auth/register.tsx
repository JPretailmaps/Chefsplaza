import { loginSuccess } from '@redux/auth/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { settingService } from '@services/index';
import { Button } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { NextPageContext } from 'next/types';
import SeoMetaHead from '@components/common/seo-meta-head';
import Image from 'next/image';
import style from './register.module.scss';

const mapStatesToProps = (state: any) => ({

});

const mapDispatch = { loginSuccess, updateCurrentUser };

const connector = connect(mapStatesToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type IProps = {
  loginPlaceholderImage: string;
  modelBenefit: string;
  userBenefit: string;
} & PropsFromRedux;

function Register({
  loginPlaceholderImage,
  modelBenefit,
  userBenefit
}: IProps) {
  const [loginAs, setLoginAs] = useState('user');

  const handleSwitch = (value) => {
    setLoginAs(value);
  };

  return (
    <>
      <SeoMetaHead pageTitle="Register" />
      <div className="main-container">
        <div className={classNames(
          style['welcome-box']
        )}
        >
          <div className={`${style['content-left']}`}>
            <Image
              fill
              quality={70}
              alt="placeholder-image"
              sizes="(max-width: 768px) 100vw, (max-width: 2100px) 50vw"
              src={loginPlaceholderImage || '/auth-img.png'}
            />
          </div>
          <div className={`${style['content-right']}`}>
            <div className={style['switch-btn']}>
              <Button
                type={loginAs === 'user' ? 'primary' : 'default'}
                onClick={() => handleSwitch('user')}
              >
                Fan Signup
              </Button>
              <Button
                type={loginAs === 'performer' ? 'primary' : 'default'}
                onClick={() => handleSwitch('performer')}
              >
                Creator Signup
              </Button>
            </div>
            <div className={style['welcome-content']}>
              <h3>
                {loginAs === 'user' ? 'Fan' : 'Creator'}
                {' '}
                Benefits
              </h3>
              {loginAs === 'performer' ? (
                <>
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: modelBenefit }} />
                  <Link href="/auth/creator-register">
                    <Button type="primary" className="primary">CREATOR SIGN UP</Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: userBenefit }} />
                  <Link href="/auth/fan-register">
                    <Button type="primary" className="primary">FAN SIGN UP</Button>
                  </Link>
                </>
              )}
            </div>
            <p className="text-center">
              Have an account already?
              &nbsp;
              <Link href="/auth/login">
                Log in here.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = 'public';
Register.authenticate = false;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const meta = await settingService.valueByKeys([
    'loginPlaceholderImage',
    'modelBenefit',
    'userBenefit'
  ]);

  return {
    props: {
      userBenefit: meta?.userBenefit || '',
      modelBenefit: meta?.modelBenefit || '',
      loginPlaceholderImage: meta?.loginPlaceholderImage || ''
    }
  };
};

export default connector(Register);
