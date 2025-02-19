import { message } from 'antd';
import dynamic from 'next/dynamic';
import {
  forwardRef, useContext, useEffect, useRef, useState
} from 'react';
import { AgoraProvider } from 'src/agora';
import { SocketContext } from 'src/socket';
import {
  ClockCircleOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { streamService } from '@services/stream.service';
import { showError } from '@lib/utils';
import {
  getStreamConversationSuccess, loadStreamMessages, resetStreamMessage
} from '@redux/stream-chat/actions';
import Price from '@components/common/price';
import { useRouter } from 'next/router';
import { LiveIcon, WalletIcon } from 'src/icons';
import { IStream } from '@interfaces/stream';
import classNames from 'classnames';
import StartBtn from './start-btn';
import EditStream from './edit-stream';
import CallTime from '../call-time';
import Watching from './watching';
import { STREAM_EVENT } from '../constants';
import style from '../streaming.module.scss';
import { MuteButton } from '../viewer/mute-button';

const Publisher = dynamic(() => import('@components/streaming/agora/publisher'), {
  ssr: false,
  loading: () => <div style={{ height: 394, borderRadius: 6 }} className="skeleton-loading" />
});

const ChatBox = dynamic(() => import('@components/stream-chat/chat-box'), {
  ssr: false,
  loading: () => <div style={{ height: 394, borderRadius: 6 }} className="skeleton-loading" />
});

const ForwardedPublisher = forwardRef((props: {
  uid: string,
  onStatusChange: Function,
  conversationId: string;
  sessionId: string;
}, ref) => <Publisher {...props} forwardedRef={ref} />);

function GoLiveWrapper() {
  const user = useSelector((state: any) => state.user.current);
  const { connected, socket } = useContext(SocketContext);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStream, setActiveStream] = useState<IStream>(null);
  const publisherRef = useRef(null);
  const callTimeRef = useRef(null);
  const setDurationStreamTimeOut = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const conversation = useRef(null);

  const updateStreamDuration = async () => {
    setDurationStreamTimeOut.current && clearTimeout(setDurationStreamTimeOut.current);
    if (!activeStream) return;
    const { sec } = callTimeRef.current.getCurrent();
    if (sec > 0) {
      await streamService.updateStreamDuration({ streamId: activeStream._id, duration: sec });
    } else {
      callTimeRef.current.start();
    }
    setDurationStreamTimeOut.current = setTimeout(() => updateStreamDuration, 15 * 1000);
  };

  const onStart = async (payload) => {
    try {
      setLoading(true);
      const resp = await streamService.goLive(payload);
      setActiveStream(resp.data.stream);
      conversation.current = resp.data.conversation;
    } catch (e) {
      showError(e, 'Stream server error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const onStop = async () => {
    if (!window.confirm('Are you sure you want to end this session?')) return;
    leavePublicRoom();
    message.success('Stream session has ended! Redirecting...');
    router.push({
      pathname: '/[profileId]',
      query: {
        profileId: user.username || user._id
      }
    }, `/${user.username || user._id}`);
  };

  const onStreamStatusChange = (started: boolean) => {
    if (started) {
      setInitialized(true);
      setLoading(false);
      updateStreamDuration();
    } else {
      initialized && callTimeRef.current.stop();
      setDurationStreamTimeOut.current && clearTimeout(setDurationStreamTimeOut.current);
    }
  };

  const leavePublicRoom = () => {
    if (socket && activeStream?.conversationId) {
      socket.emit(STREAM_EVENT.LEAVE_ROOM, { conversationId: activeStream.conversationId });
      dispatch(resetStreamMessage());
    }
  };

  useEffect(() => {
    if (activeStream) {
      dispatch(getStreamConversationSuccess(conversation.current));
      dispatch(loadStreamMessages({
        conversationId: conversation.current._id,
        offset: 0,
        limit: 25
      }));
      socket && socket.emit(STREAM_EVENT.JOIN_ROOM, {
        conversationId: activeStream.conversationId
      });
      publisherRef.current && publisherRef.current.publish();
    }
    return () => {
      initialized && callTimeRef.current.stop();
      setDurationStreamTimeOut.current && clearTimeout(setDurationStreamTimeOut.current);
    };
  }, [activeStream]);

  if (!connected()) return <div className="text-center">Initiating connection...</div>;

  return (
    <AgoraProvider config={{ mode: 'live', codec: 'h264', role: 'host' }}>
      <div className={classNames(
        style['page-streaming']
      )}
      >
        <div className="page-streaming-left page-streaming-model">
          <div className="box-streaming-left">
            <div className="left-top-streaming">
              <div>
                <ClockCircleOutlined />
                <CallTime ref={callTimeRef} started={initialized} />
              </div>
              <div>
                <WalletIcon />
                <Price amount={user?.balance || 0} />
              </div>
            </div>
            <div className="show-streaming-box" hidden={initialized}>
              <div className="show-streaming-center">
                <div className="box-streaming-center">
                  <div className="streaming-content">
                    <p><LiveIcon /></p>
                    <span>Live streaming</span>
                  </div>
                </div>
              </div>
            </div>
            {initialized && (
              <div className="buttons-stream">
                <MuteButton type="publish" />
                <Watching conversationId={activeStream?.conversationId || ''} />
              </div>
            )}
            <ForwardedPublisher
              uid={user._id}
              onStatusChange={onStreamStatusChange}
              ref={publisherRef}
              conversationId={activeStream?.conversationId || ''}
              sessionId={activeStream?.sessionId}
            />
          </div>
          <div className={classNames('show-streaming-button', {
            'stop-streaming': initialized
          })}
          >
            <StartBtn
              initialized={initialized}
              loading={loading}
              onStart={onStart}
              onStop={onStop}
            />
          </div>
          <EditStream stream={activeStream} />
        </div>
        <div className="page-streaming-right">
          <ChatBox
            canReset={user?._id === activeStream?.performerId}
            conversationId={activeStream?.conversationId}
          />
        </div>
      </div>
    </AgoraProvider>
  );
}

export default GoLiveWrapper;
