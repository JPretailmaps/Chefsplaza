import { IPerformer } from '@interfaces/performer';
import {
  Button
} from 'antd';
import { useRouter } from 'next/router';
import { connect, ConnectedProps } from 'react-redux';
import { MessageIcon } from 'src/icons';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import style from './user-actions-group.module.scss';

const FollowButton = dynamic(() => import('../buttons/follow-button'));
const TipPerformerButton = dynamic(() => import('../tip/tip-btn'));
const BookmarkButton = dynamic(() => import('@components/action-buttons/bookmark-button'));
const ShareButtons = dynamic(() => import('../buttons/share-profile'), { ssr: false });

const mapStates = (state: any) => ({
  user: state.user.current
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {
  performer: IPerformer;
} & PropsFromRedux;

function UserActionsGroup({
  performer,
  user
}: Props) {
  const router = useRouter();

  return (
    <div className={classNames(
      style['actions-grp']
    )}
    >
      <FollowButton performer={performer} />
      <TipPerformerButton classes={classNames(style['btn-action'], style['btn-border'])} performer={performer} hideText />
      <Button
        disabled={!user._id || user.isPerformer}
        onClick={() => router.push({
          pathname: '/messages',
          query: {
            toSource: 'performer',
            toId: (performer._id) || ''
          }
        })}
      >
        <MessageIcon />
        <span className="show-mobile">Message</span>
      </Button>
      <BookmarkButton
        classes={classNames(style['btn-action'], style['btn-border'])}
        objectId={performer?._id}
        objectType="performer"
        bookmarked={!!performer?.isBookMarked}
      />
      <ShareButtons performer={performer} />
    </div>
  );
}

export default connector(UserActionsGroup);
