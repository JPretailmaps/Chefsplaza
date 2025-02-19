import { IUser } from '@interfaces/user';
import { userService } from '@services/user.service';
import { useEffect, useState } from 'react';
import { DebounceSelect } from '@components/common/base/debouce-select';
import { Avatar } from 'antd';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
}

const userEl = (user: IUser) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 7, margin: 0, textTransform: 'capitalize'
  }}
  >
    <Avatar
      size={20}
      alt="avatar"
      style={{
        borderRadius: '50%', height: 20, width: 20, objectFit: 'cover'
      }}
      src={user?.avatar || '/no-avatar.jpg'}
    />
    {`${user?.name || user?.username || 'Unknow'}`}
  </div>
);

export function SelectUserDropdown({
  placeholder, style, onSelect, defaultValue, disabled
}: IProps) {
  const [defaultOptions, setDefaultOptions] = useState([]);

  const loadUsers = async (q: string) => {
    const resp = await userService.search(!q ? {
      limit: 100, status: 'active', includedIds: defaultValue || ''
    } : {
      limit: 100, status: 'active', q
    });
    const data = [...[{
      label: 'Select a user',
      value: ''
    }], ...(resp?.data?.data || []).map((d) => ({
      value: d._id,
      label: userEl(d)
    }))];
    defaultValue && setDefaultOptions(data);
    return data;
  };

  useEffect(() => {
    loadUsers('');
  }, [defaultValue]);

  return (
    <DebounceSelect
      defaultOptions={defaultOptions}
      showSearch
      defaultValue={defaultValue}
      placeholder={placeholder}
      style={style}
      onChange={(e) => onSelect(e?.value || '')}
      optionFilterProp="children"
      disabled={disabled}
      fetchOptions={loadUsers}
      allowClear
    />
  );
}
