import { Layout } from 'antd';
import getConfig from 'next/config';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SiderMenu } from './menu';
import style from './sider.module.scss';

const { publicRuntimeConfig: config } = getConfig();
const SwitchTheme = dynamic(() => import('./theme-switch'));

interface ISiderProps {
  collapsed: boolean;
  isMobile: boolean;
  menus: any;
  logo: string;
}

function Sider({
  collapsed, isMobile, menus, logo
}: ISiderProps) {
  const { theme } = useTheme();

  return (
    <Layout.Sider
      width={256}
      theme={theme as any}
      breakpoint="lg"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={collapsed ? `${style.sider} ${style.collapsed}` : style.sider}
    >
      <div className={style.brand}>
        <Link href="/">
          <Image
            alt="logo"
            width={150}
            height={150}
            quality={70}
            priority
            sizes="(max-width: 768px) 50vw, (max-width: 2100px) 15vw"
            src={logo}
          />
        </Link>
      </div>
      <div className={style.menu_container}>
        <SiderMenu
          menus={menus}
          theme={theme}
          isMobile={isMobile}
          collapsed={collapsed}
        />
      </div>
      <div className={style.switch_theme}>
        <span>
          v
          {config.BUILD_VERSION}
        </span>
        {!collapsed && (
          <SwitchTheme />
        )}
      </div>
    </Layout.Sider>
  );
}

export default Sider;
