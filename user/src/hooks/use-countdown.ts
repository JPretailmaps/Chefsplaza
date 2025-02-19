import { useEffect, useRef, useState } from 'react';

const useCountdown = (defaultNumber = 0) => {
  const [number, setNumber] = useState(defaultNumber);
  const _timeout = useRef(null);

  const reduceNum = () => {
    setTimeout(() => {
      setNumber((prev) => {
        if (prev > 0) {
          reduceNum();
          return prev - 1;
        }
        clearTimeout(_timeout.current);
        return defaultNumber;
      });
    }, 1000);
  };

  const setCountdown = (n = 60) => {
    if (_timeout.current) clearTimeout(_timeout.current);
    setNumber(n);
    reduceNum();
  };

  useEffect(() => () => {
    if (_timeout.current) clearTimeout(_timeout.current);
  }, []);

  return {
    countTime: number,
    setCountdown
  };
};

export default useCountdown;
