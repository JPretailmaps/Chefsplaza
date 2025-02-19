import { FloatButton } from 'antd';
import { connect } from 'react-redux';
import { updateUIValue, loadUIValue } from 'src/redux/ui/actions';
import { IUIConfig } from 'src/interfaces/ui-config';
import {
  PieChartOutlined, ContainerOutlined, UserOutlined, WomanOutlined,
  VideoCameraOutlined, CameraOutlined, StopOutlined, FileImageOutlined,
  SkinOutlined, DollarOutlined, HeartOutlined, MenuOutlined,
  FireOutlined, MailOutlined, NotificationOutlined, AreaChartOutlined
} from '@ant-design/icons';
import Header from '@components/common/layout/header';
import { Router } from 'next/router';
import Loader from '@components/common/base/loader';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { IUser } from 'src/interfaces';
import classnames from 'classnames';
import dynamic from 'next/dynamic';
import style from './primary-layout.module.scss';

const Sider = dynamic(() => import('@components/common/layout/sider'), { ssr: false, loading: () => <div style={{ width: 256 }} className="skeleton-loading" /> });

interface DefaultProps extends IUIConfig {
  children: any;
  ui: IUIConfig;
  updateUIValue: Function;
  loadUIValue: Function;
  currentUser: IUser;
}

function PrimaryLayout({
  children, ui, updateUIValue: handleUpdateUI, loadUIValue: handleLoadUI, currentUser
}: DefaultProps) {
  const [routerChange, setRouterChange] = useState(false);

  const onCollapseChange = (collapsed) => {
    handleUpdateUI({ collapsed });
  };

  const onRouterChangComplete = () => {
    setTimeout(() => setRouterChange(false), 500);
  };

  useEffect(() => {
    handleLoadUI();
    Router.events.on('routeChangeStart', () => setRouterChange(true));
    Router.events.on('routeChangeComplete', onRouterChangComplete);
    return () => {
      Router.events.off('routeChangeStart', () => setRouterChange(true));
      Router.events.off('routeChangeComplete', onRouterChangComplete);
    };
  }, []);

  const {
    collapsed, logo
  } = ui;

  const sliderMenus = [
    {
      id: 'blockCountry',
      name: 'Block Countries',
      icon: <StopOutlined />,
      children: [
        {
          id: 'countries',
          name: 'List countries',
          route: '/block-countries'
        }
      ]
    },
    {
      id: 'email-template',
      name: 'Email Templates',
      icon: <MailOutlined />,
      children: [
        {
          id: 'email-templates-listing',
          name: 'All email templates',
          route: '/email-templates'
        }
      ]
    },
    {
      id: 'posts',
      name: 'Posts',
      icon: <ContainerOutlined />,
      children: [
        {
          id: 'post-page',
          name: 'All posts',
          route: '/posts?type=page'
        },
        {
          id: 'page-create',
          name: 'Create new',
          route: '/posts/create?type=page'
        }
      ]
    },
    {
      id: 'menu',
      name: 'Existing Menu Options',
      icon: <MenuOutlined />,
      children: [
        {
          id: 'menu-listing',
          name: 'All menu options',
          route: '/menu'
        },
        {
          name: 'Create new',
          id: 'create-menu',
          route: '/menu/create'
        }
      ]
    },
    {
      id: 'coupon',
      name: 'Coupons',
      icon: <DollarOutlined />,
      children: [
        {
          id: 'coupon-listing',
          name: 'All coupons',
          route: '/coupon'
        },
        {
          name: 'Create new',
          id: 'create-coupon',
          route: '/coupon/create'
        }
      ]
    },
    {
      id: 'banner',
      name: 'Banners',
      icon: <FileImageOutlined />,
      children: [
        {
          id: 'banner-listing',
          name: 'All banners',
          route: '/banners'
        },
        {
          name: 'Upload new',
          id: 'upload-banner',
          route: '/banners/upload'
        }
      ]
    },
    {
      id: 'accounts',
      name: 'Users',
      icon: <UserOutlined />,
      children: [
        {
          name: 'All users',
          id: 'users',
          route: '/users'
        },
        {
          name: 'Create new',
          id: 'users-create',
          route: '/users/create'
        }
      ]
    },
    {
      id: 'performers',
      name: 'Creators',
      icon: <WomanOutlined />,
      children: [
        {
          name: 'All Creators',
          id: 'creators',
          route: '/creator'
        },
        {
          name: 'Create new',
          id: 'create-performers',
          route: '/creator/create'
        }
      ]
    },
    {
      id: 'category',
      name: 'Creator Categories',
      icon: <AreaChartOutlined />,
      children: [
        {
          id: 'Category-list',
          name: 'All categories',
          route: '/creator-category'
        },
        {
          id: 'Category-create',
          name: 'Create New',
          route: '/creator-category/create'
        }
      ]
    },
    {
      id: 'feed',
      name: 'Feed Posts',
      icon: <FireOutlined />,
      children: [
        {
          id: 'newsfeed',
          name: 'All posts',
          route: '/feed'
        },
        // {
        //   id: 'video_posts',
        //   name: 'Video Posts',
        //   route: '/feed?type=video'
        // },
        // {
        //   id: 'photo_posts',
        //   name: 'Photo Posts',
        //   route: '/feed?type=photo'
        // },
        {
          id: 'create_post',
          name: 'Create new',
          route: '/feed/create'
        }
      ]
    },
    {
      id: 'videos',
      name: 'Videos',
      icon: <VideoCameraOutlined />,
      children: [
        {
          id: 'video-listing',
          name: 'All videos',
          route: '/video'
        },
        {
          id: 'video-upload',
          name: 'Upload new',
          route: '/video/upload'
        },
        {
          id: 'video-bulk-upload',
          name: 'Bulk upload',
          route: '/video/bulk-upload'
        }
      ]
    },
    {
      id: 'performers-photos',
      name: 'Galleries',
      icon: <CameraOutlined />,
      children: [
        {
          id: 'gallery-listing',
          name: 'All galleries',
          route: '/gallery'
        },
        {
          name: 'Create new gallery',
          id: 'create-galleries',
          route: '/gallery/create'
        },
        // {
        //   id: 'photo-listing',
        //   name: 'Photos',
        //   route: '/photos'
        // },
        {
          name: 'Upload new photo',
          id: 'upload-photo',
          route: '/photos/upload'
        },
        {
          name: 'Bulk upload',
          id: 'bulk-upload-photo',
          route: '/photos/bulk-upload'
        }
      ]
    },
    {
      id: 'performers-products',
      name: 'Products',
      icon: <SkinOutlined />,
      children: [
        {
          id: 'product-listing',
          name: 'All products',
          route: '/product'
        },
        {
          name: 'Create new',
          id: 'create-product',
          route: '/product/create'
        }
      ]
    },
    {
      id: 'report',
      name: 'Reports',
      icon: <NotificationOutlined />,
      children: [
        {
          id: 'Report',
          name: 'All reports',
          route: '/report'
        }
      ]
    },
    {
      id: 'order',
      name: 'Order History',
      icon: <ContainerOutlined />,
      children: [
        {
          id: 'orders',
          name: 'All orders',
          route: '/order'
        }
      ]
    },
    {
      id: 'earning',
      name: 'Earning History',
      icon: <DollarOutlined />,
      children: [
        {
          id: 'earning-money',
          name: 'Earnings',
          route: '/earnings'
        }
      ]
    },
    {
      id: 'subscription',
      name: 'Subscriptions',
      icon: <HeartOutlined />,
      children: [
        {
          name: 'All subscriptions',
          id: 'subscriptions',
          route: '/subscription'
        },
        {
          name: 'Create new',
          id: 'create-subscription',
          route: '/subscription/create'
        }
      ]
    },
    {
      id: 'payments',
      name: 'Payment History',
      icon: <DollarOutlined />,
      children: [
        {
          id: 'payment',
          name: 'All cash payments',
          route: '/cash-payments'
        }
      ]
    },
    {
      id: 'transactions',
      name: 'Wallet Transactions',
      icon: <DollarOutlined />,
      children: [
        {
          id: 'wallet-transactions',
          name: 'All wallet transactions',
          route: '/wallet-transactions'
        }
      ]
    },
    {
      id: 'request-payout',
      name: 'Payout Requests',
      icon: <NotificationOutlined />,
      children: [
        {
          id: 'payout',
          name: 'All payout requests',
          route: '/payout-request'
        }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <PieChartOutlined />,
      children: [
        {
          id: 'system-settings',
          route: '/settings',
          as: '/settings',
          name: 'Settings'
        }
      ]
    }
  ];

  return (
    <div className={style['main-container']} id="primaryLayout">
      <Header
        collapsed={collapsed}
        onCollapseChange={onCollapseChange}
        currentUser={currentUser}
      />
      <Sider
        collapsed={collapsed}
        isMobile={isMobile}
        logo={logo}
        menus={sliderMenus}
      />
      <div className={classnames(style['main-content'], {
        [style.collapsed]: !collapsed
      })}
      >
        {routerChange && <Loader />}
        {children}
      </div>
      <FloatButton.BackTop className={style.backTop} target={() => document.querySelector('#primaryLayout') as any} />
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  ui: state.ui,
  auth: state.auth,
  currentUser: { ...state.user.current }
});
const mapDispatchToProps = { updateUIValue, loadUIValue };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
