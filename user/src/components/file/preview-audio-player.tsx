import { useRef } from 'react';

interface IProps {
  source: string;
}

export function PreviewAudioPlayer({
  source
}: IProps) {
  const audioRef = useRef(null);

  const onLoadedMetadata = () => {
    // if (audioRef.current) {
    //   if (audioRef.current.duration === Infinity) {
    //     getDuration(defaultDuration);
    //     return;
    //   }
    //   getDuration(audioRef.current.duration);
    // }
  };

  return (
    <div className="preview-audio-player">
      <audio ref={audioRef} onLoadedMetadata={onLoadedMetadata} controls>
        <source src={source} type="audio/ogg" />
      </audio>
    </div>
  );
}
