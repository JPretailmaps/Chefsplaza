import { Avatar, Badge } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect, ConnectedProps } from 'react-redux';
import {
  HomeIcon, MessageIcon, ModelIcon, PlusIcon
} from 'src/icons';
import {
  messageService
} from 'src/services';
import { Event } from 'src/socket';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import { IUser } from '@interfaces/user';
import style from './middle-menu.module.scss';

const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

const UserMenuDrawer = dynamic(() => import('./user-menu-drawer'));

const mapState = (state: any) => ({
  currentUser: { ...state.user.current }
});

type IProps = {
  currentUser: IUser;
}

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

export function MiddleMenu({ currentUser }: IProps & PropsFromRedux) {
  const router = useRouter();
  const [totalNotReadMessage, setTotalNotReadMessage] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);

  const handleMessage = async (event) => {
    event && setTotalNotReadMessage(event.total);
  };

  const handleCountNotificationMessage = async () => {
    const data = await (await messageService.countTotalNotRead()).data;
    if (data) {
      setTotalNotReadMessage(data.total);
    }
  };

  const handleChangeRoute = () => {
    setOpenProfile(false);
  };

  useEffect(() => {
    router.events.on('routeChangeStart', handleChangeRoute);
    return () => {
      router.events.off('routeChangeStart', handleChangeRoute);
    };
  }, []);

  useEffect(() => {
    currentUser._id && handleCountNotificationMessage();
  }, [currentUser._id]);

  return (
    <>
      <Event
        event="nofify_read_messages_in_conversation"
        handler={handleMessage}
      />
      <div className={classNames(style['nav-bar'])}>
        <ul className={style['nav-icons']}>
          {currentUser._id && (
            <>
              <li className={classNames({ [style.active]: router.pathname === '/home' })}>
                <Link href="/home">
                  <HomeIcon />
                </Link>
              </li>
              {currentUser?.isPerformer ? (
                <li className={classNames({ [style.active]: router.pathname === '/creator/my-post/create' })}>
                  <Link href="/creator/my-post/create">
                    <PlusIcon />
                  </Link>
                </li>
              ) : (
                <li key="model" className={classNames({ [style.active]: router.pathname === '/creator' })}>
                  <Link href="/creator">
                    <ModelIcon />
                  </Link>
                </li>
              )}
              <li key="messenger" className={classNames({ [style.active]: router.pathname === '/messages' })}>
                <Link href="/messages">
                  <MessageIcon />
                  <Badge
                    className={style.bagde}
                    count={totalNotReadMessage}
                    showZero
                  />
                </Link>
              </li>
            </>
          )}
          {!currentUser._id ? (
            <>
              <li key="logo" className={style['logo-nav']}>
                <Logo />
              </li>
              <div className={style['header-right-nologin']}>
                <li key="login" className={['/auth/login'].includes(router.pathname) ? 'active' : ''}>
                  <Link href="/">
                    Log In
                  </Link>
                </li>
                <li key="signup" className={router.pathname === '/auth/register' ? 'active' : ''}>
                  <Link href="/auth/register">
                    Sign Up
                  </Link>
                </li>
              </div>
            </>
          ) : (
            <li
              key="menu-profile"
              aria-hidden
              onClick={() => setOpenProfile(true)}
              className={style['menu-profile']}
            >
              <Avatar
                src={currentUser?.avatar || '/no-avatar.jpg'}
                srcSet={currentUser?.avatar || '/no-avatar.jpg'}
              />
            </li>
          )}
          {openProfile && <UserMenuDrawer openProfile={openProfile} onCloseProfile={() => setOpenProfile(false)} />}
        </ul>
      </div>
    </>
  );
}

export default connector(MiddleMenu);
