import { settingService } from '@services/setting.service';
import { useEffect, useRef, useState } from 'react';

const useSettings = (keys = []) => {
  const [loading, setLoading] = useState(true);
  const state = useRef({}) as any;

  const loadSettings = async () => {
    try {
      const res = await settingService.valueByKeys(keys);
      setLoading(false);
      state.current = res;
    } catch {
      setLoading(false);
      state.current = {};
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    loading,
    data: state.current
  };
};

export default useSettings;
