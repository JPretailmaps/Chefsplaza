import { CaretUpOutlined, MoreOutlined } from '@ant-design/icons';
import { CommentForm } from '@components/comment';
import {
  Button, Dropdown, MenuProps
} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useSelector } from 'react-redux';
import { IComment, IUser } from 'src/interfaces/index';
import dynamic from 'next/dynamic';
import style from './comment-item.module.scss';
import { ListComments } from './list-comments';

const LikeButton = dynamic(() => import('@components/action-buttons/like-button'));

interface IProps {
  item: IComment;
  onDelete?: Function;
  canReply?: boolean;
}

function CommentItem({
  item,
  onDelete = () => { },
  canReply = true
}: IProps) {
  const [totalReply, setTotalReply] = useState(item.totalReply);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const listRef = useRef(null);

  const user: IUser = useSelector((state: any) => state.user.current);

  const onOpenComment = () => {
    setIsOpenComment(!isOpenComment);
  };

  const onNewComment = (val) => {
    listRef.current?.appendNew(val);
    setTotalReply(totalReply + 1);
  };

  const items: MenuProps['items'] = [
    {
      key: item._id,
      label: 'Delete',
      onClick: () => onDelete(item)
    }
  ];

  useEffect(() => {
    setTotalReply(item.totalReply);
  }, [item.totalReply]);

  return (
    <>
      <div
        className={classNames(
          style['cmt-item']
        )}
        key={item._id}
      >
        <img alt="creator-avt" src={item?.creator?.avatar || '/no-avatar.jpg'} />
        <div className="cmt-content">
          <div className="cmt-user">
            <span>
              <span>{item?.creator?.name || item?.creator?.username || 'N/A'}</span>
              <span className="cmt-time">{moment(item.createdAt).fromNow()}</span>
            </span>
            {user && item?.isAuth && (
              <Dropdown menu={{ items }} className={style['cmt-handle-options']}>
                <MoreOutlined />
              </Dropdown>
            )}
          </div>
          <p className="cmt-text">{item.content}</p>
          <div className="cmt-action">
            <LikeButton
              objectId={item._id}
              objectType="comment"
              performerId={item?.creator?._id}
              totalLike={item.totalLike || 0}
              liked={!!item?.isLiked}
            />
            {canReply && (
            <Button
              aria-hidden
              className={classNames({
                'cmt-reply': true,
                active: isReply
              })}
              onClick={() => setIsReply(!isReply)}
            >
              Reply
            </Button>
            )}
          </div>
          <div className={isReply ? `${style['reply-bl-form']} ${style.active}` : style['reply-bl-form']}>
            <div className="feed-comment">
              <CommentForm
                onSuccess={onNewComment}
                objectId={item._id}
                objectType="comment"
                isReply
              />
            </div>
          </div>
          {canReply && totalReply > 0 && (
            <div className={style['view-cmt']}>
              <a className="primary-color" aria-hidden onClick={() => onOpenComment()}>
                {' '}
                <CaretUpOutlined rotate={!isOpenComment ? 180 : 0} />
                {' '}
                {!isOpenComment ? 'View reply' : 'Hide reply'}
              </a>
            </div>
          )}
        </div>
      </div>
      {isOpenComment && (
        <div className={style['reply-bl-list']}>
          <ListComments
            key={`comments_${item._id}`}
            objectId={item._id}
            objectType="comment"
            ref={listRef}
            canReply={false}
          />
        </div>
      )}
    </>
  );
}

CommentItem.defaultProps = {
  onDelete: () => {},
  canReply: false
};

export default CommentItem;
