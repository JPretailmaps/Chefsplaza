/* eslint-disable react/jsx-no-useless-fragment */
import {
  HeartOutlined, HeartFilled, LikeOutlined, LikeFilled
} from '@ant-design/icons';
import { shortenLargeNumber } from '@lib/number';
import { showError } from '@lib/utils';
import { reactionService } from '@services/reaction.service';
import { Button, message } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IUser } from '@interfaces/user';
import style from './like-button.module.scss';

type Props = {
  liked?: boolean;
  totalLike?: number;
  performerId?: string;
  objectType: string;
  objectId: string;
  displayType?: string;
};

function LikeButton({
  performerId,
  objectType,
  objectId,
  liked,
  totalLike,
  displayType
}: Props) {
  const [isLiked, setLiked] = useState(liked);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(totalLike);

  const user = useSelector((state: any) => state.user.current) as IUser;

  const onReaction = async () => {
    try {
      if (performerId === user._id && objectType === 'comment') {
        message.error("You can't like your own comment!");
        return;
      }
      setLoading(true);
      if (!isLiked) {
        await reactionService.create({ objectId, objectType, action: 'like' });
        setLiked(true);
        setTotal(total + 1);
      } else {
        await reactionService.delete({
          objectId,
          objectType,
          action: 'like'
        });
        setLiked(false);
        setTotal(total - 1);
      }
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTotal(totalLike);
  }, [totalLike]);

  return (
    <Button
      className={classNames(
        style['ant-btn'],
        style['action-btn'],
        {
          [style.active]: isLiked
        }
      )}
      onClick={onReaction}
      disabled={loading || !user?._id}
    >
      {total > 0 && shortenLargeNumber(total)}
      &nbsp;
      {['feed'].includes(displayType) ? (
        <>
          {isLiked ? <HeartFilled /> : <HeartOutlined />}
        </>
      ) : (
        <>
          {isLiked ? <LikeFilled /> : <LikeOutlined />}
        </>
      )}

    </Button>
  );
}

LikeButton.defaultProps = {
  liked: false,
  totalLike: 0,
  performerId: '',
  displayType: 'default'
};

export default LikeButton;
