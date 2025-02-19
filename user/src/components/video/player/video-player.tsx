import 'video.js/dist/video-js.css';
import { useEffect, useRef, useState } from 'react';
import { useInView, defaultFallbackInView } from 'react-intersection-observer';
import classNames from 'classnames';
import videojs from 'video.js';
import { isMobile } from 'react-device-detect';
import style from './video-player.module.scss';

type IProps = {
  options: any;
  onReady?: Function;
  onPlaying?: Function;
}

defaultFallbackInView(false);

export function VideoPlayer({ options, onReady, onPlaying }: IProps) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [preInview, setPreInview] = useState(false);
  const { ref, inView } = useInView({
    threshold: isMobile ? 0.7 : 0.99
  });

  const onChangeVolume = () => {
    const players = videojs.getAllPlayers();
    const { current } = playerRef;
    if (!current) return;
    const volume = current.volume();
    const isMuted = current.muted();
    sessionStorage.setItem('defaultVolume', `${isMuted ? 0 : volume}`);
    ([...players]).forEach((player) => {
      if (player.id_ === `${current.id_}`) return;
      // eslint-disable-next-line no-param-reassign
      player.volume(volume);
      player.muted(isMuted);
    });
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      // eslint-disable-next-line no-multi-assign
      const player = playerRef.current = videojs(videoElement, {
        ...options,
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
        onReady && onReady(player);
      });
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;
    player && onPlaying && player.on('play', () => onPlaying(true, player));
    player && onPlaying && player.on('pause', () => onPlaying(false, player));

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        player.off('volumechange', onChangeVolume);
        playerRef.current = null;
      }
      player && onPlaying && player.off('play', () => onPlaying(true, player));
      player && onPlaying && player.off('pause', () => onPlaying(false, player));
    };
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (inView) {
      setTimeout(() => {
        setPreInview(true);
      }, 400);
    } else {
      setPreInview(false);
    }
    if (player && options?.playInview && player.isReady_) {
      const video = player.el().querySelector('video');
      video.paused && inView && preInview && player.readyState() >= 3 && player.play();
      !inView && player.pause();
    }
  }, [inView, preInview]);

  return (
    <div
      className={classNames(options?.classes, {
        [style['videojs-player']]: true,
        [style.active]: true
      })}
      ref={ref}
    >
      <div data-vjs-player ref={videoRef} />
    </div>
  );
}

VideoPlayer.defaultProps = {
  onReady: () => { },
  onPlaying: () => { }
};

export default VideoPlayer;
