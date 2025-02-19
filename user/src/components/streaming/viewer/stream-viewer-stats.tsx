import { ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { videoDuration } from '@lib/duration';
import {
  useEffect, useImperativeHandle, useRef, useState
} from 'react';
import { WalletIcon } from 'src/icons';

type Props = {
  initialDuration?: number;
  forwardedRef: any;
};

function StreamViewerStats({
  initialDuration, forwardedRef
}: Props) {
  const [sessionDuration, setSessionDuration] = useState(initialDuration);

  const user = useSelector((state: any) => state.user.current);
  const durationTimeout = useRef(null);
  const startDuration = (val = null) => {
    if (durationTimeout.current) durationTimeout.current = clearTimeout(durationTimeout.current);
    if (val) setDuration(val);

    durationTimeout.current = setTimeout(() => {
      setDuration((preVal) => preVal + 1);
      startDuration();
    }, 1000);
  };

  const stopDuration = () => {
    durationTimeout.current && clearTimeout(durationTimeout.current);
  };

  const setDuration = (d) => {
    setSessionDuration(d);
  };

  useImperativeHandle(forwardedRef, () => ({
    setDuration,
    startDuration,
    stopDuration
  }));

  useEffect(() => {
    durationTimeout.current && clearTimeout(durationTimeout.current);
    return () => {
      durationTimeout.current && clearTimeout(durationTimeout.current);
    };
  }, []);

  return (
    <>
      <div className="stat-item">
        <WalletIcon />
        {`$${(user?.balance || 0).toFixed(2)}`}
      </div>
      <div className="stat-item">
        <ClockCircleOutlined />
        {videoDuration(sessionDuration)}
      </div>
    </>
  );
}

StreamViewerStats.defaultProps = {
  initialDuration: 0
};

export default StreamViewerStats;
