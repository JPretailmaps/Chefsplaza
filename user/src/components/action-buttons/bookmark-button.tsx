import {
  BookOutlined, BookFilled
} from '@ant-design/icons';
import { showError } from '@lib/utils';
import { reactionService } from '@services/reaction.service';
import { Button, message, Tooltip } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IUser } from '@interfaces/user';
import style from './bookmark-button.module.scss';

type Props = {
  bookmarked: boolean;
  objectType: string;
  objectId: string;
  classes?: string;
};

export function BookmarkButton({
  classes,
  objectType,
  objectId,
  bookmarked
}: Props) {
  const [isBookmarked, setBookmarked] = useState(bookmarked);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user.current) as IUser;

  const onReaction = async () => {
    try {
      setLoading(true);
      if (!isBookmarked) {
        await reactionService.create({ objectId, objectType, action: 'bookmark' });
        setBookmarked(true);
      } else {
        await reactionService.delete({
          objectId,
          objectType,
          action: 'bookmark'
        });
        setBookmarked(false);
      }
      message.success(!isBookmarked ? 'Added to Bookmarks' : 'Removed from Bookmarks');
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={
          classNames(
            classes,
            style['action-ico'],
            style['action-btn'],
            {
              [style.active]: isBookmarked
            }
          )
        }
      onClick={onReaction}
      disabled={loading || !user?._id || user?.isPerformer}
    >
      {isBookmarked ? <BookFilled /> : <BookOutlined />}
      <span className="show-mobile">Bookmarks</span>
    </Button>
  );
}

BookmarkButton.defaultProps = {
  classes: ''
};

export default BookmarkButton;
