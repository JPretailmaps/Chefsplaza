import { useEffect, useState } from 'react';
import { galleryService } from '@services/gallery.service';

import { DebounceSelect } from '@components/common/base/debouce-select';
import { IGallery } from 'src/interfaces';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
  performerId?: string;
  showAll?: boolean;
}

const galleryEl = (gallery: IGallery) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 7, margin: 0, textTransform: 'capitalize'
  }}
  >
    {`${gallery?.title || gallery?.slug || 'Unknow'}`}
  </div>
);

export function SelectGalleryDropdown({
  defaultValue, style, onSelect, disabled, showAll, placeholder, performerId
}: IProps) {
  const [defaultOptions, setDefaultOptions] = useState([]);

  const search = async (q: string) => {
    const resp = await galleryService.search(!q ? {
      limit: 100, status: 'active', performerId: performerId || ''
    } : {
      limit: 100, status: 'active', q
    });
    const data = [...[{
      disabled: showAll,
      label: showAll ? 'All galleries' : 'Select a gallery',
      value: ''
    }], ...(resp?.data?.data || []).map((d) => ({
      value: d._id,
      label: galleryEl(d)
    }))];
    (defaultValue || !showAll) && setDefaultOptions(data);
    return data;
  };

  useEffect(() => {
    search('');
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
      fetchOptions={search}
      allowClear
    />
  );
}

SelectGalleryDropdown.defaultProps = {
  placeholder: 'Type to search...',
  style: null,
  defaultValue: '',
  disabled: false,
  showAll: false,
  performerId: ''
};

export default SelectGalleryDropdown;
