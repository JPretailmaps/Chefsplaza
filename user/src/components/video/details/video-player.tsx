import { IVideo } from '@interfaces/video';
import { Button, Spin, message } from 'antd';
import { formatDate } from '@lib/date';
import dynamic from 'next/dynamic';
import {
  useContext, useEffect, useRef, useState
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tokenTransctionService } from '@services/token-transaction.service';
import { showError } from '@lib/utils';
import { ImageWithFallback } from '@components/common';
import { updateBalance } from '@redux/user/actions';
import { SocketContext } from 'src/socket';
import style from './video-player.module.scss';

const VideoSubscribeButtons = dynamic(() => import('@components/video/details/subscribe-button'));
const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')));
const VideoStatusPlayer = dynamic(() => import('@components/video/player/video-player-with-file-status'));

type Props = {
  video: IVideo
};

function VideoDetailPlayer({
  video
}: Props) {
  const [isBought, setIsBought] = useState(video.isBought);
  const [requesting, setRequesting] = useState(false);
  const user = useSelector((state: any) => state.user.current);
  const thumbUrl = video.thumbnail?.url || (video.teaser?.thumbnails && video.teaser?.thumbnails[0]) || (video.video.thumbnails && video.video.thumbnails[0]) || '/leaf.jpg';
  const { isSubscribed } = video;
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);
  const init = useRef(false);

  const viewable = (!video.isSale && isSubscribed && !video.isSchedule) || (video.isSale && isBought && !video.isSchedule);

  const purchaseVideo = async () => {
    try {
      // const { video, user, updateBalance: handleUpdateBalance } = this.props;
      if (!user._id) {
        message.error('Please log in!');
        // Router.push({
        //   pathname: '/auth/login',
        //   href: '/'
        // });
        return;
      }
      if (user.isPerformer) {
        return;
      }
      setRequesting(true);
      await tokenTransctionService.purchaseVideo(video._id, {});
      message.success('Video is unlocked!');
      dispatch(updateBalance({ token: -video.price }));
      setIsBought(true);
      setRequesting(false);
      // TODO - reload video
    } catch (e) {
      showError(e);
      setRequesting(false);
    }
  };

  const renderTeaser = () => {
    if (!video.teaser) {
      return (
        <div className="video-thumbs">
          <ImageWithFallback
            options={{
              width: 500,
              height: 500,
              style: { borderRadius: 20, width: '100%' }
            }}
            alt="thumbnail"
            src={thumbUrl}
          />
        </div>
      );
    }

    if (video.teaserProcessing) {
      return (
        <div className="vid-processing">
          <div className="text-center">
            <Spin />
            <br />
            Teaser is currently on processing
          </div>
        </div>
      );
    }

    const teaserOptions = {
      key: `${video._id}_teaser`,
      autoplay: true,
      controls: true,
      playsinline: true,
      sources: [
        {
          src: video.teaser?.url,
          type: 'video/mp4'
        }
      ]
    };

    return <VideoPlayer options={teaserOptions} />;
  };

  const onPaymentSuccess = ({ item }) => {
    // TODO refetch url video if S3
    if (!item || item._id !== video._id || isBought) return;
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

  if (viewable) {
    const videoJsOptions = {
      key: video._id,
      autoplay: true,
      controls: true,
      playsinline: true,
      poster: thumbUrl,
      sources: [
        {
          src: video.video.url,
          type: 'video/mp4'
        }
      ]
    };
    return video.processing ? (
      <VideoStatusPlayer
        target="videoId"
        fileId={video.video._id}
        targetId={video._id}
        thumbUrl={thumbUrl || '/leaf.jpg'}
        options={{
          autoplay: true,
          controls: true,
          playsinline: true,
          fluid: true,
          sources: [
            {
              src: video.video.url,
              type: 'video/mp4'
            }
          ]
        }}
      />
    ) : <VideoPlayer options={videoJsOptions} />;
  }

  return (
    <div className={style['vid-player']}>
      <div className="vid-group">
        {renderTeaser()}
        <div className="vid-exl-group">
          {/* eslint-disable-next-line no-nested-ternary */}
          <h3>{(video.isSale && !isBought && !video.isSchedule) ? 'UNLOCK TO VIEW FULL CONTENT' : (!video.isSale && !isSubscribed && !video.isSchedule) ? 'SUBSCRIBE TO VIEW FULL CONTENT' : 'VIDEO IS UPCOMING'}</h3>
          <div className="text-center">
            {video.isSale && !isBought && (
              <Button
                block
                className="primary"
                loading={requesting}
                disabled={requesting}
                onClick={purchaseVideo}
                style={{ borderRadius: 20 }}
              >
                PAY $
                {video.price.toFixed(2)}
                {' '}
                TO UNLOCK
              </Button>
            )}
            {!video.isSale && !isSubscribed && (
              <div
                style={{ padding: '0 10px' }}
                className="subscription-btn-grp"
              >
                <VideoSubscribeButtons performer={video.performer} />
              </div>
            )}
          </div>
          {video.isSchedule && (
            <h4 style={{ marginTop: 15 }}>
              Main video will be premiered on
              {' '}
              {formatDate(video.scheduledAt, 'll')}
            </h4>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoDetailPlayer;
