import { Switch } from 'antd';
import { useTheme } from 'next-themes';

export function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      onChange={() => (setTheme(theme === 'dark' ? 'light' : 'dark'))}
      checked={theme === 'dark'}
      defaultChecked={false}
      checkedChildren="Dark"
      unCheckedChildren="Light"
    />
  );
}

export default SwitchTheme;
