import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { IPerformer } from '@interfaces/performer';
import { IUser } from '@interfaces/user';
import { followService } from '@services/follow.service';
import { Button, Tooltip, message } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { showError } from '@lib/utils';
import style from './follow-button.module.scss';

interface P {
  performer: IPerformer;
  onFollow?: Function;
  classes?: string;
}

function FollowButton({ performer, onFollow, classes }: P) {
  if (!performer) return null;
  const [isFollowed, setIsFollowed] = useState(performer.isFollowed);
  const user = useSelector((state: any) => state.user.current) as IUser;

  const handleFollow = async () => {
    if (user.isPerformer) return;
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    try {
      if (!isFollowed) {
        await followService.create(performer._id);
        setIsFollowed(true);
      } else {
        await followService.delete(performer._id);
        setIsFollowed(false);
      }
      onFollow && onFollow(!isFollowed);
    } catch (e) {
      showError(e);
    }
  };

  return (
    <Button
      disabled={!!user?.isPerformer}
      onClick={handleFollow}
      className={classNames(classes, style['follow-btn'], {
        active: isFollowed
      })}
    >
      {isFollowed ? <Tooltip title="Following"><HeartFilled /></Tooltip> : <Tooltip title="Follow"><HeartOutlined /></Tooltip>}
      <span className="show-mobile">{isFollowed ? 'Following' : 'Follow'}</span>
    </Button>
  );
}

FollowButton.defaultProps = {
  onFollow: () => {},
  classes: ''
};

export default FollowButton;
