import {
  BankOutlined, BlockOutlined, BookOutlined, CreditCardOutlined,
  DollarOutlined, FireOutlined, HeartOutlined, HistoryOutlined, LogoutOutlined,
  NotificationOutlined, PictureOutlined, PlusCircleOutlined, ShoppingCartOutlined,
  ShoppingOutlined, StopOutlined, UserOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { shortenLargeNumber } from '@lib/number';
import { logout } from '@redux/auth/actions';
import {
  Avatar,
  Divider, Drawer
} from 'antd';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  HomeIcon, TickIcon, WalletIcon,
  LiveIcon
} from 'src/icons';
import {
  authService
} from 'src/services';
import { SocketContext } from 'src/socket';

import classNames from 'classnames';
import { ISettings } from '@interfaces/setting';
import dynamic from 'next/dynamic';
import useSettings from 'src/hooks/use-settings';
import style from './user-menu-drawer.module.scss';

const DarkmodeSwitch = dynamic(() => import('@components/common/base/darkmode-switch'), { ssr: false });

type IProps = {
  openProfile: boolean;
  onCloseProfile: Function;
  logoutHandler: Function;
  settings: ISettings;
}

const mapState = (state: any) => ({
  currentUser: { ...state.user.current },
  settings: state.settings
});
const mapDispatch = {
  logoutHandler: logout
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

function UserMenuDrawer({
  onCloseProfile,
  openProfile,
  currentUser,
  logoutHandler,
  settings
}: IProps & PropsFromRedux) {
  if (!currentUser?._id) return null;
  const { data: streamSettings } = useSettings(['agoraEnable', 'agoraAppId']);
  const router = useRouter();
  const { getSocket } = useContext(SocketContext);

  const beforeLogout = () => {
    const token = authService.getToken();
    const socket = getSocket();
    if (token && socket) {
      socket.emit('auth/logout', {
        token
      });
    }
    logoutHandler();
  };

  return (
    <Drawer
      closable
      onClose={() => onCloseProfile()}
      open={openProfile}
      key="profile-drawer"
      className={classNames(
        style['profile-drawer']
      )}
      width={300}
      title={(
        <>
          <div className={style['profile-user']}>
            <Avatar
              className="avatar"
              size={50}
              src={currentUser.avatar || '/no-avatar.jpg'}
              srcSet={currentUser.avatar || '/no-avatar.jpg'}
            />
            <span className="profile-name">
              <span>
                {currentUser.name || 'N/A'}
                &nbsp;
                <TickIcon />
              </span>
              <span className="sub-name">
                @
                {currentUser.username || 'n/a'}
              </span>
            </span>
          </div>
          <div className={style['sub-info']}>
            <a
              aria-hidden
              className={style['user-balance']}
              onClick={() => (!currentUser.isPerformer ? Router.push('/wallet') : Router.push('/creator/earning'))}
            >
              <WalletIcon />
              &nbsp;
              $
              {(currentUser.balance || 0).toFixed(2)}
              {!currentUser.isPerformer && <PlusCircleOutlined />}
            </a>
            {currentUser.isPerformer ? (
              <Link href="/creator/my-subscriber" className={style['user-balance']}>
                <HeartOutlined />
                &nbsp;
                Subscribers
                &nbsp;
                {shortenLargeNumber(currentUser.stats?.subscribers || 0)}
              </Link>
            ) : (
              <Link href="/user/my-subscription" className={style['user-balance']}>
                <HeartOutlined />
                &nbsp;
                Subscription
                &nbsp;
                {shortenLargeNumber(currentUser.stats?.totalSubscriptions || 0)}
              </Link>
            )}
          </div>
        </>
      )}
    >
      {currentUser.isPerformer && (
        <div className={style['profile-menu-item']}>
          {streamSettings.agoraEnable && streamSettings.agoraAppId && (
            <>
              <Link href="/creator/live">
                <div className={classNames(style['menu-item'], {
                  [style.active]: router.asPath === '/creator/live'
                })}
                >
                  <LiveIcon />
                  {' '}
                  Go Live
                </div>
              </Link>
              <Divider />
            </>
          )}
          <Link href={{ pathname: '/[profileId]', query: { profileId: currentUser.username || currentUser._id } }} as={`/${currentUser.username || currentUser._id}`}>
            <div className={classNames(style['menu-item'], {
              [style.active]: router.asPath === `/${currentUser.username || currentUser._id}`
            })}
            >
              <HomeIcon />
              &nbsp;
              My Profile
            </div>
          </Link>
          <Link href="/creator/account">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/account'
              })}
            >
              <UserOutlined />
              &nbsp;
              Edit Profile
            </div>
          </Link>
          <Link href="/creator/blacklist">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/blacklist'
              })}
            >
              <BlockOutlined />
              &nbsp;
              Blacklist
            </div>
          </Link>
          <Link href="/creator/block-countries">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/block-countries'
              })}
            >
              <StopOutlined />
              &nbsp;
              Block Countries
            </div>
          </Link>
          <Link href="/creator/banking">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/banking'
              })}
            >
              <BankOutlined />
              &nbsp;
              Banking (to earn)
            </div>
          </Link>
          <Divider />
          <Link href="/creator/my-post">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/my-post'
              })}
            >
              <FireOutlined />
              &nbsp;
              My Feeds
            </div>
          </Link>
          <Link href="/creator/my-video">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/my-video'
              })}
            >
              <VideoCameraOutlined />
              &nbsp;
              My Videos
            </div>
          </Link>
          <Link href="/creator/my-store">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/my-store'
              })}
            >
              <ShoppingOutlined />
              &nbsp;
              My Products
            </div>
          </Link>
          <Link href="/creator/my-gallery">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/my-gallery'
              })}
            >
              <PictureOutlined />
              &nbsp;
              My Galleries
            </div>
          </Link>
          <Divider />
          <Link href={{ pathname: '/creator/my-order' }}>
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/my-order'
              })}
            >
              <ShoppingCartOutlined />
              &nbsp;
              Order History
            </div>
          </Link>
          <Link href="/creator/earning">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/earning'
              })}
            >
              <DollarOutlined />
              &nbsp;
              Earning History
            </div>
          </Link>
          <Link href="/creator/payout-request">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/creator/payout-request'
              })}
            >
              <NotificationOutlined />
              &nbsp;
              Payout Requests
            </div>
          </Link>
          <Divider />
          <DarkmodeSwitch />
          <div aria-hidden className={style['menu-item']} onClick={beforeLogout}>
            <LogoutOutlined />
            &nbsp;
            Sign Out
          </div>
        </div>
      )}
      {!currentUser.isPerformer && (
        <div className={style['profile-menu-item']}>
          <Link href="/user/account" as="/user/account">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/user/account'
              })}
            >
              <UserOutlined />
              &nbsp;
              Edit Profile
            </div>
          </Link>
          {['stripe'].includes(settings.paymentGateway) && settings.stripePublishableKey && (
            <Link href="/user/cards">
              <div
                className={classNames(style['menu-item'], {
                  [style.active]: router.asPath === '/user/cards'
                })}
              >
                <CreditCardOutlined />
                &nbsp;
                Add Card
              </div>
            </Link>
          )}
          <Link href="/user/bookmarks">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/user/bookmarks'
              })}
            >
              <BookOutlined />
              &nbsp;
              Bookmarks
            </div>
          </Link>
          <Link href="/user/my-subscription">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/user/my-subscription'
              })}
            >
              <HeartOutlined />
              &nbsp;
              Subscriptions
            </div>
          </Link>
          <Divider />
          <Link href="/user/orders">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/user/orders'
              })}
            >
              <ShoppingCartOutlined />
              &nbsp;
              Order History
            </div>
          </Link>
          <Link href="/user/payment-history">
            <div
              className={classNames(style['menu-item'], {
                [style.active]: router.asPath === '/user/payment-history'
              })}
            >
              <HistoryOutlined />
              &nbsp;
              Payment History
            </div>
          </Link>
          <Link href="/user/wallet-transaction">
            <div className={classNames(style['menu-item'], {
              [style.active]: router.asPath === '/user/wallet-transaction'
            })}
            >
              <DollarOutlined />
              &nbsp;
              Wallet Transactions
            </div>
          </Link>
          <Divider />
          <DarkmodeSwitch />
          <div className={style['menu-item']} aria-hidden onClick={beforeLogout}>
            <LogoutOutlined />
            &nbsp;
            Sign Out
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default connector(UserMenuDrawer);
