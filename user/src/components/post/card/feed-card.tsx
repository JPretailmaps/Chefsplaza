import { IFeed } from '@interfaces/feed';
import Link from 'next/link';
import { formatDate } from '@lib/date';
import { TickIcon } from 'src/icons';
import { useSelector } from 'react-redux';
import {
  useContext, useEffect, useRef, useState
} from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { ImageWithFallback } from '@components/common';
import { skeletonLoading, skeletonLoadingBtn } from '@lib/loading';
import { SocketContext } from 'src/socket';
import { StarFilled } from '@ant-design/icons';
import DropdownActions from './dropdown-actions';
import style from './feed-card.module.scss';

const FeedSlider = dynamic(() => import('./card-container/post-slider'));
const ScheduledStreamingContent = dynamic(() => import('./card-container/scheduled-streaming'));
const LockContentMiddle = dynamic(() => import('./card-container/lock-content-middle'));
const FeedPolls = dynamic(() => import('./card-container/post-polls-list'), { ssr: false, loading: skeletonLoading });
const TipBtn = dynamic(() => import('@components/performer/tip/tip-btn'));
const BookmarkButton = dynamic(() => import('@components/action-buttons/bookmark-button'));
const LikeButton = dynamic(() => import('@components/action-buttons/like-button'));
const ReportBtn = dynamic(() => import('@components/report/report-btn'));
const CommentButton = dynamic(() => import('@components/action-buttons/comment-button'), { ssr: false, loading: skeletonLoadingBtn });
const JoinStreamButton = dynamic(() => import('@components/action-buttons/join-live-button'), { ssr: false, loading: skeletonLoadingBtn });
const CommentWrapper = dynamic(() => import('@components/comment/comment-wrapper'), { ssr: false });
const ViewMediaPopupContainer = dynamic(() => import('src/context/view-media-popup/view-media-popup-container'), { ssr: false });

type Props = {
  feed: IFeed;
};

function FeedCard({
  feed
}: Props) {
  const user = useSelector((state: any) => state.user.current);
  const [openComment, setOpenComment] = useState(false);
  const { performer } = feed;
  const { socket } = useContext(SocketContext);
  const [isBought, setIsBought] = useState(feed.isBought);
  const init = useRef(false);

  const onPaymentSuccess = ({ item }) => {
    // TODO refetch url video if S3
    if (!item || item._id !== feed._id || isBought) return;
    setIsBought(true);
  };

  useEffect(() => {
    if (!init.current && socket) {
      socket.on('token_transaction_success', onPaymentSuccess);
      init.current = true;
    }
    return () => {
      socket && socket.off('token_transaction_success', onPaymentSuccess);
    };
  }, [socket]);

  let canView = (!feed.isSale && feed.isSubscribed)
    || (feed.isSale && feed.price && isBought)
    || ['text', 'scheduled-streaming'].includes(feed.type)
    || (feed.isSale && !feed.price);

  if (!user._id || (`${user._id}` !== `${feed.fromSourceId}` && user.isPerformer)) {
    canView = false;
  }
  return (
    <div className={classNames(
      style['feed-card']
    )}
    >
      <div className={style['feed-top']}>
        <Link href={{ pathname: '/[profileId]', query: { profileId: performer?.username || performer?._id } }} as={`/${performer?.username || performer?._id}`}>
          <div className={style['feed-top-left']}>
            <ImageWithFallback
              options={{
                width: 100,
                height: 100,
                quality: 30,
                sizes: '(max-width: 767px) 10vw, (min-width: 768px) 5vw'
              }}
              alt="per_atv"
              fallbackSrc="/no-avatar.jpg"
              src={performer?.avatar || '/no-avatar.jpg'}
            />
            <div className={style['feed-name']}>
              <div className={style.name}>
                {performer?.name || 'N/A'}
                {' '}
                {performer?.verifiedAccount && <TickIcon />}
                &nbsp;
                {performer?.isFeatured && <StarFilled />}
                &nbsp;&nbsp;
                {performer?.live > 0 && user?._id !== performer?._id && <JoinStreamButton feed={feed} user={user} />}
              </div>
              <div className={style.username}>
                @
                {performer?.username || 'n/a'}
              </div>
            </div>
            <span className={classNames({
              [style['online-status']]: true,
              [style.active]: performer?.isOnline
            })}
            />
          </div>
        </Link>
        <div className={style['feed-top-right']}>
          <span className={style['feed-time']}>{formatDate(feed.updatedAt, 'MMM DD')}</span>
          <DropdownActions feed={feed} />
        </div>
      </div>
      <div className={style['feed-container']}>
        <div className={style['feed-text']}>
          {feed.text}
        </div>
        {feed.polls.length > 0 && <FeedPolls feed={feed} />}
        {feed.type === 'scheduled-streaming' && <ScheduledStreamingContent feed={feed} />}
        {!['text', 'scheduled-streaming'].includes(feed.type) && (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {canView ? (<ViewMediaPopupContainer><FeedSlider feed={feed} /></ViewMediaPopupContainer>
            ) : <LockContentMiddle feed={feed} />}
          </>
        )}
      </div>
      <div className="feed-bottom">
        <div className={style['feed-actions']}>
          <div className={style['action-item']}>
            <LikeButton
              objectId={feed._id}
              objectType="feed"
              displayType="feed"
              performerId={feed.fromSourceId}
              totalLike={feed.totalLike}
              liked={feed.isLiked}
            />
            <CommentButton
              totalComment={feed.totalComment}
              active={openComment}
              onClick={() => setOpenComment(!openComment)}
            />
            <TipBtn performer={performer} />
          </div>
          <div className={style['action-item']}>
            <ReportBtn target="feed" targetId={feed._id} performer={performer} />
            <BookmarkButton objectId={feed._id} objectType="feed" bookmarked={feed.isBookMarked} />
          </div>
        </div>
        {openComment && (
          <div className="feed-comment">
            <CommentWrapper objectId={feed._id} objectType="feed" />
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedCard;
