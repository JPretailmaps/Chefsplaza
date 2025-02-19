import { useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Input } from 'antd';
import style from './ConversationSearch.module.scss';

interface IProps {
  onSearch: Function;
}

export function ConversationSearch({ onSearch }: IProps) {
  return (
    <div className={classNames(
      style['conversation-search']
    )}
    >
      <Input
        addonBefore={<SearchOutlined />}
        onChange={(v) => onSearch(v)}
        className={style['conversation-search-input']}
        placeholder="Search contact..."
      />
    </div>
  );
}

export default ConversationSearch;
