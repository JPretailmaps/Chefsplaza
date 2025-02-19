import BookmarkButton from './bookmark-button';
import CommentButton from './comment-button';
import LikeButton from './like-button';
import style from './reaction-buttons.module.scss';

type Props = {
  isLiked?: boolean;
  totalLike?: number;
  isBookmarked?: boolean;
  totalBookmark?: number;
  totalComment?: number;
  onCommentClick?: Function;
  activeComment?: boolean;
  objectType: string;
  objectId: string;
};

function ReactionButtons({
  objectType,
  objectId,
  isLiked = false,
  totalLike = 0,
  totalBookmark = 0,
  totalComment = 0,
  onCommentClick = () => {},
  activeComment = false,
  isBookmarked = false
}: Props) {
  return (
    <div className={style['act-btns']}>
      <LikeButton objectType={objectType} objectId={objectId} liked={isLiked} totalLike={totalLike} />
      <CommentButton onClick={onCommentClick} active={activeComment} totalComment={totalComment} />
      <BookmarkButton objectType={objectType} objectId={objectId} bookmarked={isBookmarked} />
    </div>
  );
}

export default ReactionButtons;
