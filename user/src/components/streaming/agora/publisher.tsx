import { streamService } from '@services/stream.service';
import { ILocalTrack, UID } from 'agora-rtc-sdk-ng';
import { Router } from 'next/router';
import React, {
  useContext, useEffect, useImperativeHandle, useRef, useState
} from 'react';
import { Player, useAgora } from 'src/agora';
import { createLocalTracks } from 'src/agora/utils';
import { SocketContext } from 'src/socket';

type Props = {
  uid: UID;
  forwardedRef: any;
  onStatusChange: Function;
  conversationId: string;
  sessionId: string;
};

type LocalTracks = {
  videoTrack: ILocalTrack;
  audioTrack: ILocalTrack;
}

export default function Publisher({
  uid, forwardedRef, onStatusChange, conversationId, sessionId
}: Props) {
  const [tracks, setTracks] = useState([]);
  const { client, appConfiguration } = useAgora();
  const { agoraAppId } = appConfiguration;
  const { socket } = useContext(SocketContext);
  const localTracks = useRef<LocalTracks>({ videoTrack: null, audioTrack: null });
  const clientRef = useRef<any>();
  const publish = async () => {
    if (!client || !conversationId || !sessionId) return;

    // const uid = generateUid(performerId);
    const resp = await streamService.fetchAgoraAppToken({
      channelName: sessionId
    });

    await client.join(agoraAppId, sessionId, resp.data, uid);

    const [microphoneTrack, cameraTrack] = await createLocalTracks(
      {},
      { encoderConfig: { bitrateMax: 1000 } }
    );

    await client.publish([microphoneTrack, cameraTrack]);
    setTracks([microphoneTrack, cameraTrack]);
    onStatusChange(true);
    localTracks.current = { videoTrack: cameraTrack, audioTrack: microphoneTrack };
    socket && conversationId && socket.emit('public-stream/live', { conversationId });
  };

  const leave = async () => {
    Object.keys(localTracks.current).forEach((trackName) => {
      if (localTracks.current[trackName]) {
        localTracks.current[trackName].stop();
        localTracks.current[trackName].close();
      }
    });
    localTracks.current = { videoTrack: null, audioTrack: null };
    setTracks([]);
    onStatusChange(false);
    if (clientRef.current && clientRef.current.uid) {
      await clientRef.current.leave();
    }
  };

  const onbeforeunload = () => {
    leave();
  };

  useImperativeHandle(forwardedRef, () => ({
    publish,
    leave
  }));

  useEffect(() => {
    clientRef.current = client;
    if (!client) return;

    client.on('connection-state-change', (state) => {
      // eslint-disable-next-line no-console
      console.log(state);
    });
  }, [client]);

  useEffect(() => {
    Router.events.on('routeChangeStart', onbeforeunload);
    window.addEventListener('beforeunload', onbeforeunload);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
      Router.events.off('routeChangeStart', onbeforeunload);
    };
  }, []);

  return <Player tracks={tracks} type="publish" />;
}
