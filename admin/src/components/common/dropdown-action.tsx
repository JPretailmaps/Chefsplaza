import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';

interface IMenuOption {
  key: string;
  name: string;
  onClick?: Function;
  children?: any;
}

interface IProps {
  menuOptions?: IMenuOption[];
  buttonStyle?: any;
  dropdownProps?: any;
  nameButtonMain?: string;
}

export function DropdownAction(props: IProps) {
  const {
    menuOptions = [],
    buttonStyle,
    dropdownProps,
    nameButtonMain
  } = props;
  const menu = menuOptions.map((item) => (
    <Menu.Item key={item.key} onClick={() => item.onClick && item.onClick()}>
      {item.children || item.name}
    </Menu.Item>
  ));
  return (
    <Dropdown overlay={<Menu>{menu}</Menu>} {...dropdownProps}>
      <Button style={{ ...buttonStyle }}>
        {nameButtonMain || 'Action'}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}
