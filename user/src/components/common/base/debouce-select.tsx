import {
  Empty, Select, SelectProps, Skeleton
} from 'antd';
import { debounce } from 'lodash';
import {
  ReactNode, useEffect, useMemo, useRef, useState
} from 'react';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  defaultOptions?: any;
  emptyDescription?: string;
}

export function DebounceSelect<
  ValueType extends { key?: string; label: ReactNode; value: string | number } = any,
>({
  fetchOptions, debounceTimeout, defaultOptions, emptyDescription, ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  useEffect(() => {
    if (defaultOptions.length) {
      setOptions(defaultOptions);
    }
  }, [defaultOptions]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      loading={fetching}
      notFoundContent={fetching ? <Skeleton active avatar /> : <Empty description={emptyDescription} />}
      {...props}
      options={options}
    />
  );
}

DebounceSelect.defaultProps = {
  debounceTimeout: 800,
  defaultOptions: [],
  emptyDescription: 'No data found'
};
