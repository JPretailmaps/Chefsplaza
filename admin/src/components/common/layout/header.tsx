import {
  Menu, Avatar, Dropdown,
  MenuProps
} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { IUser } from 'src/interfaces';
import { logout } from '@redux/auth/actions';
import { useDispatch } from 'react-redux';
import style from './header.module.scss';

interface IProps {
  collapsed: boolean;
  onCollapseChange: Function;
  currentUser: IUser;
}

function Header({ collapsed, onCollapseChange, currentUser }: IProps) {
  const dispatch = useDispatch();

  const items: MenuProps['items'] = [
    {
      key: 'settings',
      label: (
        <Link href="/account/settings">
          Update profile
        </Link>
      )
    },
    {
      key: 'logout',
      label: (
        <a aria-hidden onClick={() => dispatch(logout())}>
          Log out
        </a>
      )
    }
  ];

  return (
    <div className={style['main-header']} style={{ width: !collapsed ? 'calc(100% - 256px)' : 'calc(100% - 80px)' }} id="layoutHeader">
      <div
        aria-hidden
        className={style['collapse-btn']}
        onClick={onCollapseChange.bind(this, !collapsed)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <div className={style.rightContainer}>
        <Dropdown menu={{ items }}>
          <Avatar src={currentUser?.avatar || '/no-avatar.jpg'} />
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
