import { Button, message } from 'antd';
import { useAudioRecorder } from '@sarafhbk/react-audio-recorder';
import {
  PauseOutlined, AudioOutlined, PlayCircleOutlined, PauseCircleOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import style from './audio-recorder.module.scss';

interface IProps {
  onFinish: Function;
  isActive: boolean;
  onClose: Function;
  onStartStopRecord: Function;
  getTimeRecord: Function;
}

export default function AudioRecorder({
  onFinish, isActive, onClose, onStartStopRecord, getTimeRecord
}: IProps) {
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    status
  } = useAudioRecorder();

  const handleStartStop = () => {
    if (['recording', 'paused'].includes(status)) {
      stopRecording();
      onClose();
      onStartStopRecord(false);
      getTimeRecord(timer);
    } else {
      startRecording();
      onStartStopRecord(true);
    }
  };

  useEffect(() => {
    if (audioResult) {
      onFinish(audioResult);
    }
  }, [audioResult]);

  useEffect(() => {
    if (timer >= 900) {
      message.error('The maximum duration of the recording is 15 minutes');
      stopRecording();
      onClose();
      onStartStopRecord(false);
      getTimeRecord(timer);
    }
  }, [timer]);

  return (
    <div className={style['audio-recorder']}>
      <div className={style.recorder}>
        <div className={style.microphone}>
          <div className={classNames(
            style.waves,
            { [style.active]: status === 'recording' }
          )}
          />
          <Button className="start-btn" onClick={() => handleStartStop()}>
            {['recording', 'paused'].includes(status)
              ? (
                <>
                  <PauseOutlined />
                  {' '}
                  Stop recording
                </>
              ) : (
                <>
                  <AudioOutlined />
                  {' '}
                  Start recording
                </>
              )}
          </Button>
        </div>
        {status !== 'idle' && (
          <div className={style.timer}>
            {moment.utc(timer * 1000).format('m:ss')}
          </div>
        )}
        {status !== 'idle' && (
        <div className={style['btn-grps']}>
          {status === 'recording' && (
          <Button onClick={pauseRecording}>
            <PauseCircleOutlined />
            {' '}
            Pause
          </Button>
          )}
          {status === 'paused' && (
          <Button onClick={resumeRecording}>
            <PlayCircleOutlined />
            {' '}
            Resume
          </Button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
