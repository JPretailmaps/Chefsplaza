import {
  AppstoreOutlined,
  CalendarOutlined,
  MenuOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  DatePicker, Input, Button, Popover
} from 'antd';
import { debounce } from 'lodash';
import { useState } from 'react';
import dayjs from 'dayjs';

import classNames from 'classnames';
import {
  LiveIcon
} from 'src/icons';
import style from './search-bar.module.scss';

const { RangePicker } = DatePicker;

const { Search } = Input;

interface IProps {
  onFilter: Function;
  handleViewGrid?: Function;
  tab: string;
}

export default function FilterContentsBar({
  onFilter, handleViewGrid, tab
}: IProps) {
  const [isGrid, setIsGrid] = useState(false);
  const [type, setType] = useState('');

  const onSearch = debounce(async (e) => {
    const value = (e.target && e.target.value) || '';
    onFilter({ q: value });
  }, 500);

  const onViewGrid = (val: boolean) => {
    setIsGrid(val);
    handleViewGrid && handleViewGrid(val);
  };

  const searchDateRange = (dates: [any, any], dateStrings: [string, string]) => {
    if (!dateStrings.length) return;
    onFilter({
      fromDate: dateStrings[0],
      toDate: dateStrings[1]
    });
  };

  const onFilterLive = () => {
    setType(type === '' ? 'scheduled-streaming' : '');
    onFilter({ type: type === '' ? 'scheduled-streaming' : '' });
  };

  return (
    <div className={style['search-bar']}>
      <div className={style['grid-btns']}>
        {tab === 'post' && (
          <Button className={classNames({ active: type === 'scheduled-streaming' })} onClick={() => onFilterLive()}>
            <LiveIcon />
          </Button>
        )}
        <Popover
          trigger={['click']}
          content={(
            <Search
              placeholder="Enter keyword here..."
              onChange={(e) => {
                e.persist();
                onSearch(e);
              }}
              allowClear
              enterButton
            />
          )}
        >
          <Button><SearchOutlined /></Button>
        </Popover>
        <Popover
          trigger={['click']}
          content={(
            <RangePicker
              disabledDate={(current) => current > dayjs().endOf('day') || current < dayjs().subtract(10, 'years').endOf('day')}
              onChange={searchDateRange}
            />
          )}
        >
          <Button><CalendarOutlined /></Button>
        </Popover>
        {tab === 'post' && <Button aria-hidden className={classNames({ active: isGrid })} onClick={() => onViewGrid(true)}><AppstoreOutlined /></Button>}
        {tab === 'post' && <Button aria-hidden className={classNames({ active: !isGrid })} onClick={() => onViewGrid(false)}><MenuOutlined /></Button>}
      </div>
    </div>
  );
}

FilterContentsBar.defaultProps = {
  handleViewGrid: null
};
