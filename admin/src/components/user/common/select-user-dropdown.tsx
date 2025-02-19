import { DebounceSelect } from '@components/common/base/debouce-select';
import { userService } from '@services/user.service';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
  showAll?: boolean;
}

const userEl = (user: any) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 7, margin: 0, textTransform: 'capitalize'
  }}
  >
    <Avatar
      alt="avatar"
      src={user?.avatar || '/no-avatar.jpg'}
    />
    &nbsp;
    {`${user?.name || user?.username || 'Unknow'}`}
  </div>
);

export function SelectUserDropdown({
  defaultValue, style, onSelect, disabled, showAll, placeholder
}: IProps) {
  const [defaultOptions, setDefaultOptions] = useState([]);

  const loadusers = async (q: string) => {
    const resp = await userService.search(!q ? {
      limit: 100, status: 'active', includedIds: defaultValue || ''
    } : {
      limit: 100, status: 'active', q
    });
    const data = [...[{
      disabled: !showAll,
      label: showAll ? 'All users' : 'Select a user',
      value: ''
    }], ...(resp?.data?.data || []).map((d) => ({
      value: d._id,
      label: userEl(d)
    }))];
    (defaultValue || !showAll) && setDefaultOptions(data);
    return data;
  };

  useEffect(() => {
    loadusers('');
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
      fetchOptions={loadusers}
      allowClear
    />
  );
}

SelectUserDropdown.defaultProps = {
  placeholder: 'Type to search...',
  style: null,
  defaultValue: '',
  disabled: false,
  showAll: false
};

export default SelectUserDropdown;
