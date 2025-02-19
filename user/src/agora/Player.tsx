import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';

import style from './player.module.scss';
import 'video.js/dist/video-js.css';
import { useAgora } from './AgoraProvider';

interface Props {
  tracks: Array<
    | ILocalVideoTrack
    | IRemoteVideoTrack
    | ILocalAudioTrack
    | IRemoteAudioTrack
    | undefined
  >;
  type: 'publish' | 'subscribe';
}

export function Player({ tracks, type }: Props) {
  const videoRef = useRef<any>(null);

  const playerRef = useRef<any>();

  const { setPublishRef, setPlayRef } = useAgora();
  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        bigPlayButton: false,
        controls: true,
        muted: true,
        controlBar: {
          playToggle: false,
          pictureInPictureToggle: false,
          volumePanel: false
        }
      }, () => {
        if (type === 'publish') {
          setPublishRef(playerRef.current);
        } else {
          setPlayRef(playerRef.current);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      if (tracks.length) {
        const mediaStreamTracks = tracks.map((track) => track.getMediaStreamTrack());
        const mediaStream = new MediaStream(mediaStreamTracks);
        (playerRef.current.tech().el() as HTMLVideoElement).srcObject = mediaStream;
      } else {
        (playerRef.current.tech().el() as HTMLVideoElement).srcObject = null;
        (playerRef.current.tech().el() as HTMLVideoElement).poster = '/processed.jpeg';
      }
    }
  }, [playerRef.current, tracks]);

  return (
    <div className={style['publisher-player']}>
      <video
        data-vjs-player
        ref={videoRef}
        className="video-js vjs-16-9"
        controls
        autoPlay
        muted
        playsInline
      />
    </div>
  );
}

Player.defaultProps = {};
Player.displayName = 'AgoraPlayer';
