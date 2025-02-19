import 'video.js/dist/video-js.css';
import {
  useEffect, useRef, useState
} from 'react';
import videojs from 'video.js';
import { Button, message } from 'antd';
import { fileService } from 'src/services';
import { LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import style from './video-player.module.scss';

interface ITranscodePlayer {
  target: 'messageId' | 'videoId' | 'feedId';
  targetId: string;
  options?: any;
  thumbUrl: string;
  fileId: string;
  onReady?: Function;
}

export function VideoStatusPlayer({
  target = 'messageId',
  targetId,
  options = {},
  thumbUrl,
  fileId,
  onReady
}: ITranscodePlayer) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const timeout = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [handleMessage, setMessage] = useState('Video is on progressing, please wait or comeback later!');

  const onChangeVolume = () => {
    const players = videojs.getAllPlayers();
    const { current } = playerRef;
    if (!current) return;
    const volume = current.volume();
    const isMuted = current.muted();
    sessionStorage?.setItem('defaultVolume', `${isMuted ? 0 : volume}`);
    ([...players]).forEach((_player) => {
      if (_player.id_ === `${current.id_}`) return;
      // eslint-disable-next-line no-param-reassign
      _player.volume(volume);
      _player.muted(isMuted);
    });
  };

  const loadVideo = async () => {
    try {
      // target: feedId , videoId, messageId
      const resp = await fileService.getFileStatus(fileId, { target, targetId });
      switch (resp.data.status) {
        case 'error':
          // TODO - set error or something here
          message.error('Video file is error!', 5);
          setMessage('Video file is error!');
          break;
        case 'finished':
          setLoading(false);
          setVideoUrl(resp.data.url);
          playerRef.current && playerRef.current.play();
          break;
        case 'processing':
          timeout.current = setTimeout(loadVideo, 5000);
          break;
        default: break;
      }
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occurred, please try again later');
    }
  };

  const onClick = async () => {
    setLoading(true);
    loadVideo();
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      // eslint-disable-next-line no-multi-assign
      playerRef.current = videojs(videoElement, {
        ...options,
        sources: [
          {
            src: videoUrl || '/video-sample.mp4',
            type: 'video/mp4'
          }
        ],
        fluid: true,
        controlBar: {
          pictureInPictureToggle: false
        }
      }, () => {
        const defaultVol = Number(sessionStorage?.getItem('defaultVolume') || 0);
        playerRef.current.volume(defaultVol);
        playerRef.current.muted(!defaultVol);
        playerRef.current.on('volumechange', onChangeVolume);
        // videojs.log('player is ready');
        onReady && onReady(playerRef.current);
      });

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    }
  }, [options, videoRef]);

  useEffect(() => {
    if (!playerRef.current || !videoUrl) return;
    if (videoUrl) {
      playerRef.current.src([{
        src: videoUrl,
        type: 'video/mp4'
      }]);
      playerRef.current.play();
    }
  }, [playerRef.current, videoUrl]);

  return (
    <>
      <div
        className={classNames(options?.classes, {
          [style['videojs-player']]: true,
          [style.active]: videoUrl
        })}
      >
        <div data-vjs-player ref={videoRef} />
      </div>
      <div className={classNames(style['processing-bl'], {
        [style.active]: !videoUrl
      })}
      >
        {!loading ? (
          <Button onClick={onClick} className={style['play-btn']} title="Play Video" aria-disabled="false">
            <PlayCircleOutlined />
          </Button>
        ) : (
          <div className={style['loading-scr']}>
            <LoadingOutlined
              spin
              style={{
                fontSize: 60
              }}
            />
            <p className="text-center">{handleMessage}</p>
          </div>
        )}
        <img src={thumbUrl} alt="video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </>
  );
}

VideoStatusPlayer.defaultProps = {
  options: {
    autoplay: false,
    controls: true,
    playsinline: true,
    fluid: true
  },
  onReady: () => { }
};

export default VideoStatusPlayer;
