import {
  CommentOutlined
} from '@ant-design/icons';
import { shortenLargeNumber } from '@lib/number';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import style from './comment-button.module.scss';

type IProps = {
  onClick: Function;
  totalComment?: number;
  active?: boolean;
};

function CommentButton({
  onClick,
  totalComment = 0,
  active = false
}: IProps) {
  return (
    <Button
      onClick={() => onClick()}
      className={classNames(
        style['ant-btn'],
        style['action-btn'],
        {
          [style.active]: active
        }
      )}
    >
      {totalComment > 0 && shortenLargeNumber(totalComment)}
      {' '}
      <CommentOutlined />
    </Button>
  );
}

CommentButton.defaultProps = {
  totalComment: 0,
  active: false
};

export default CommentButton;
