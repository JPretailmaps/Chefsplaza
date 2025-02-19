import { IPerformer } from '@interfaces/performer';
import { showError } from '@lib/utils';
import { streamService } from '@services/stream.service';
import {
  Avatar, Button, Skeleton, message
} from 'antd';
import { useRouter } from 'next/router';
import {
  forwardRef, useContext, useEffect, useRef, useState
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Event, SocketContext } from 'src/socket';
import { IStream } from '@interfaces/stream';
import dynamic from 'next/dynamic';
import { getStreamConversationSuccess, loadStreamMessages, resetStreamMessage } from '@redux/stream-chat/actions';
import { AgoraProvider } from 'src/agora/AgoraProvider';
import { skeletonLoading } from '@lib/loading';
import {
  CloseOutlined,
  EyeOutlined
} from '@ant-design/icons';
import classNames from 'classnames';
import { IConversation } from '@interfaces/message';
import { STREAM_EVENT } from '../constants';
import style from '../streaming.module.scss';
import { MuteButton } from './mute-button';

type Props = {
  performer: IPerformer;
  stream: IStream;
  conversation: IConversation;
};

const TipBtn = dynamic(() => import('@components/performer/tip/tip-btn'), { ssr: false, loading: () => <Skeleton.Button /> });
const PurchaseStreamModal = dynamic(() => import('../purchase-stream-modal'), { ssr: false });
const ChatBox = dynamic(() => import('@components/stream-chat/chat-box'), { ssr: false, loading: skeletonLoading });
const Subscriber = dynamic(() => import('@components/streaming/agora/subscriber'), { ssr: false });
const StreamViewerStats = dynamic(() => import('./stream-viewer-stats'), { ssr: false });
const PerformerInfoButton = dynamic(() => import('./performer-info-btn'), { ssr: false });

const ForwardedSubscriber = forwardRef((props: {
  localUId: string;
  remoteUId: string;
  sessionId: string;
  onStreamStatusChange: Function;
}, ref) => (
  <Subscriber {...props} forwardedRef={ref} />
));

const ForwardedStats = forwardRef((props: {
  initialDuration: number,
  conversationId: string
}, ref) => (
  <StreamViewerStats {...props} forwardedRef={ref} />
));

function ViewerLiveWrapper({
  performer,
  stream,
  conversation
}: Props) {
  const [initialized, setInitialized] = useState(false);
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.current);
  const viewerStatRef = useRef(null);
  const subscriberRef = useRef(null);
  const [total, setTotal] = useState(0);

  const onChangeMembers = ({ total: _total, conversationId: cId }) => {
    if (conversation._id === cId) {
      setTotal(_total);
    }
  };

  const subscribeStream = async ({ performerId }) => {
    try {
      const resp = await streamService.joinPublicChat(performerId);
      const { streamingTime } = resp.data.stream;
      viewerStatRef.current.startDuration(streamingTime || 0);

      !initialized && retryJoin(3);
    } catch (err) {
      showError(err);
    }
  };

  const modelLeftHandler = ({ performerId }) => {
    if (performerId !== performer._id) return;
    viewerStatRef.current && viewerStatRef.current.stopDuration();
    dispatch(resetStreamMessage());
    if (socket && conversation._id) {
      socket.emit(STREAM_EVENT.LEAVE_ROOM, {
        conversationId: conversation._id
      });
    }
    message.info('Streaming session has ended!');
    router.push({
      pathname: '/[profileId]',
      query: { profileId: performer.username }
    }, `/${performer.username}`);
  };

  const leaveChat = () => {
    if (!window.confirm('Are you sure you want to leave?')) return;
    modelLeftHandler({ performerId: performer._id });
  };

  const joinConversation = async () => {
    try {
      dispatch(getStreamConversationSuccess(conversation));
      dispatch(loadStreamMessages({
        conversationId: conversation._id,
        offset: 0,
        limit: 25
      }));
      socket.emit(STREAM_EVENT.JOIN_ROOM, {
        conversationId: stream.conversationId
      });
    } catch (e) {
      showError(e);
    }
  };

  const retryJoin = (n: number) => {
    if (n === 0) return;

    if (!subscriberRef.current) {
      setTimeout(() => retryJoin(n - 1), 3000);
      return;
    }

    subscriberRef.current.join();
  };

  const onStreamStatusChange = (streaming: boolean) => {
    if (!streaming) {
      viewerStatRef.current.stopDuration();
    } else {
      setInitialized(true);
      viewerStatRef.current.startDuration();
    }
  };

  const onPurchasedStreamSuccess = () => {
    joinConversation();
  };

  const onCancelPurchase = () => {
    leaveChat();
  };

  useEffect(() => {
    if (stream.isFree || stream.hasPurchased) joinConversation();
  }, [stream]);

  return (
    <>
      <Event
        event={STREAM_EVENT.JOIN_BROADCASTER}
        handler={subscribeStream}
      />
      <Event
        event={STREAM_EVENT.MODEL_LEFT}
        handler={modelLeftHandler}
      />
      <Event
        event={STREAM_EVENT.ROOM_INFORMATIOM_CHANGED}
        handler={onChangeMembers}
      />
      <AgoraProvider
        config={{ codec: 'h264', mode: 'live', role: 'audience' }}
      >
        <div className={classNames(
          style['page-streaming']
        )}
        >
          <div className="page-streaming-left">
            <div className="box-streaming-left">
              <div className="left-top-streaming">
                <div className="page-heading">
                  <Avatar src={performer?.avatar || 'no-avatar.png'} />
                  {' '}
                  <span style={{ textTransform: 'capitalize' }}>{performer?.name}</span>
                </div>
                <ForwardedStats
                  initialDuration={stream?.streamingTime || 0}
                  conversationId={conversation._id}
                  ref={viewerStatRef}
                />
              </div>
              <div className="right-top-streaming">
                <Button className="close-streaming" onClick={leaveChat}><CloseOutlined /></Button>
              </div>
              <div className="buttons-stream">
                <PerformerInfoButton performer={performer} />
                {performer.live && (
                  <MuteButton
                    onMute={(v) => {
                      subscriberRef.current.mute(v);
                    }}
                    type="subscribe"
                  />
                )}
                <div className="btntip-mobile">
                  <TipBtn
                    performer={performer}
                    sessionId={stream.sessionId}
                    conversationId={conversation._id}
                  />
                </div>
                <div>
                  <EyeOutlined />
                  <span className="number-badge">{total}</span>
                </div>
              </div>
              <ForwardedSubscriber
                localUId={user._id}
                remoteUId={performer._id}
                ref={subscriberRef}
                sessionId={stream.sessionId}
                onStreamStatusChange={onStreamStatusChange}
              />
            </div>
            <div className="show-streaming-button">
              <Button
                block
                className="primary"
                onClick={leaveChat}
              >
                Leave Chat
              </Button>
              <TipBtn
                classes="tip-btn"
                performer={performer}
                sessionId={stream.sessionId}
                conversationId={conversation._id}
              />
            </div>
            <div className="page-streaming-bottom">
              <h3>{stream?.title || `${performer?.name || performer?.username} Live`}</h3>
              <h5>{stream?.description || 'No description'}</h5>
            </div>

          </div>
          <div className="page-streaming-right">
            <ChatBox
              canReset={(user._id === stream.performerId)}
              conversationId={conversation._id}
            />
          </div>
        </div>
        {stream && (
        <PurchaseStreamModal
          performer={performer}
          stream={stream}
          onFinish={onPurchasedStreamSuccess}
          onCancel={onCancelPurchase}
        />
        )}
      </AgoraProvider>
    </>
  );
}

export default ViewerLiveWrapper;
