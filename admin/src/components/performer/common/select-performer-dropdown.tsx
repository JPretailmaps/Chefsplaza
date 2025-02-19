import { DebounceSelect } from '@components/common/base/debouce-select';
import { performerService } from '@services/performer.service';
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

const performerEl = (performer: any) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 7, margin: 0, textTransform: 'capitalize'
  }}
  >
    <Avatar
      src={performer?.avatar || '/no-avatar.jpg'}
    />
    &nbsp;
    {`${performer?.name || performer?.username || 'Unknow'}`}
  </div>
);

export function SelectPerformerDropdown({
  defaultValue, style, onSelect, disabled, showAll, placeholder
}: IProps) {
  const [defaultOptions, setDefaultOptions] = useState([]);

  const loadPerformers = async (q: string) => {
    const resp = await performerService.search(!q ? {
      limit: 100, status: 'active', includedIds: defaultValue || ''
    } : {
      limit: 100, status: 'active', q
    });
    const data = [...[{
      disabled: !showAll,
      label: showAll ? 'All creators' : 'Select a creator',
      value: ''
    }], ...(resp?.data?.data || []).map((d) => ({
      value: d._id,
      label: performerEl(d)
    }))];
    setDefaultOptions(data);
    return data;
  };

  useEffect(() => {
    loadPerformers('');
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
      fetchOptions={loadPerformers}
      allowClear
    />
  );
}

SelectPerformerDropdown.defaultProps = {
  placeholder: 'Type to search...',
  style: null,
  defaultValue: '',
  disabled: false,
  showAll: false
};

export default SelectPerformerDropdown;
