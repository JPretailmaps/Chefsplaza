import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  connect, ConnectedProps
} from 'react-redux';
import classNames from 'classnames';
import { Skeleton } from 'antd';
import useSettings from 'src/hooks/use-settings';
import style from './style.module.scss';

const mapStates = (state: any) => ({
  siteName: state.ui.siteName,
  user: { ...state.user.current },
  menus: state.ui.menus
});

const connector = connect(mapStates);

export type PropsFromRedux = ConnectedProps<typeof connector>;

type IProps = {
} & PropsFromRedux;

function Footer({
  user = null,
  menus = []
}: IProps) {
  const { data } = useSettings(['footerContent']);
  const router = useRouter();

  const footerMenus = menus?.filter((m) => m.section === 'footer').map((m) => {
    const obj = { ...m };
    obj._id = Math.random();
    return obj;
  });

  const renderMenus = () => {
    if (!user._id) {
      return (
        <ul>
          <li key="login" className={['/', '/auth/login'].includes(router.pathname) ? 'active' : ''}>
            <Link href="/">
              Log in
            </Link>
          </li>
          <li key="signup" className={router.pathname === '/auth/register' ? 'active' : ''}>
            <Link href="/auth/register">
              Sign up
            </Link>
          </li>
          {footerMenus.map((item) => (
            <li key={item._id} className={router.pathname === item.path ? 'active' : ''}>
              <a rel="noreferrer" href={item.path} target={item.isNewTab ? '_blank' : ''}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <ul>
        <li key="home" className={router.pathname === '/home' ? 'active' : ''}>
          <Link href="/home">
            Home
          </Link>
        </li>
        <li key="model" className={router.pathname === '/creator' ? 'active' : ''}>
          <Link href="/creator">
            Creator
          </Link>
        </li>
        <li key="contact" className={router.pathname === '/contact' ? 'active' : ''}>
          <Link href="/contact">
            Contact
          </Link>
        </li>
        {footerMenus.map((item) => (
          <li key={item._id} className={router.pathname === item.path ? 'active' : ''}>
            <a rel="noreferrer" href={item.path} target={item.isNewTab ? '_blank' : ''}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className={classNames(
        style['main-footer']
      )}
      id="main-footer"
    >
      <div className="main-container">
        <img src="/logo488.png" alt="img" style={{ width: '30%' }} className={style['logo-image']} />
        {renderMenus()}
        {/* eslint-disable-next-line react/no-danger */}
        {data.footerContent ? <div className={style['footer-content']} dangerouslySetInnerHTML={{ __html: data.footerContent }} /> : <Skeleton active paragraph={{ rows: 4 }} />}
      </div>
    </div>
  );
}

export default connector(Footer);
