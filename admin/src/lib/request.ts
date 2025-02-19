import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import {
  useCallback, useEffect, useRef, useState
} from 'react';
import cookie from 'js-cookie';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { isUrl } from './string';

const { publicRuntimeConfig } = getConfig();

const omit = require('lodash/omit');

interface Return<D> extends SWRResponse {
  data: D;
  handleTableChange: Function;
  handleFilter: Function;
  handlePaginationChange: Function;
}

interface DataResponse<D = any> {
  status: number;
  data?: D;
  message?: string;
  error?: Error;
}

export type SearchRequest = {
  query: Partial<FilterQuery>;
  page: number;
  limit: number;
  setFieldValue: (key: string, value: any) => void;
  setFieldsValue: (filterQuery: Record<string, any>) => void;
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => void;
};

export type FilterQuery = {
  sort?: string;
  sortBy?: string;
  [K: string]: any;
};

export function useSearch(pageSize = 10, options = {}): SearchRequest {
  const [limit] = useState(pageSize);
  const [filters, setFilters] = useState<FilterQuery>({
    page: 1,
    ...options
  });

  const setFieldValue = (key: string, value: any) => {
    setFilters((state) => ({ ...state, [key]: value }));
  };

  const setFieldsValue = (filterQuery: Record<string, string>) => {
    setFilters((state) => ({ ...state, ...filterQuery }));
  };

  const onChange = (
    pagination: TablePaginationConfig,
    filter: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    setFilters((state) => ({
      ...state,
      ...filter,
      page: pagination.current as number,
      sortBy: sorter.field || filters.sortBy || 'createdAt',
      // eslint-disable-next-line no-nested-ternary
      sort: (sorter.order && (sorter.order === 'descend' ? 'DESC' : 'ASC')) || filters.sort || 'DESC'
    }));
  };

  return {
    query: omit(filters, 'page'),
    page: filters.page,
    limit,
    setFieldValue,
    setFieldsValue,
    onChange
  };
}

export const usePagination = ({ pageSize, current }: Partial<TablePaginationConfig>): [
  TablePaginationConfig,
  (pagination: Partial<TablePaginationConfig>) => void
] => {
  const [pagination, setState] = useState<TablePaginationConfig>({
    showSizeChanger: false,
    pageSize,
    current
  });

  const setPagination = (data: Partial<TablePaginationConfig>) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    setPagination({ pageSize });
  }, [pageSize]);

  useEffect(() => {
    setPagination({ current });
  }, [current]);

  return [pagination, setPagination];
};

export const fetcher = (url: string) => fetch(url, {
  headers: { Authorization: cookie.get('token') as string }
}).then(async (r) => {
  if (r.status >= 200 && r.status <= 300) {
    return r.json();
  }

  const error = await r.json();
  throw error;
});

// This is a SWR middleware for keeping the data even if key changes.
function laggy(useSWRNext: any) {
  return (key: any, f: any, config: any) => {
    // Use a ref to store previous returned data.
    const laggyDataRef = useRef();

    // Actual SWR hook.
    const swr = useSWRNext(key, f, config);

    useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);

    // Expose a method to clear the laggy data, if any.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);

    // Fallback to previous data if the current data is undefined.
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data;

    // Is it showing previous data?
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined;

    // Also add a `isLagging` field to SWR.
    return {
      ...swr,
      data: dataOrLaggyData,
      isLagging,
      resetLaggy
    };
  };
}

export function useClientFetch<D = any>(
  key: string,
  config?: SWRConfiguration
): Return<D> {
  const router = useRouter();
  const {
    data, error, isValidating, mutate, isLoading
  } = useSWR<DataResponse<D>>(
    isUrl(key) ? key : `${publicRuntimeConfig.API_ENDPOINT}${key}`,
    fetcher,
    {
      ...config,
      shouldRetryOnError: false,
      use: [laggy]
    }
  );

  const handleTableChange = (pag, filters, sorter) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        current: pag.current,
        pageSize: pag.pageSize,
        sortBy: sorter.field || 'updatedAt',
        sort: sorter.order === 'ascend' ? 'asc' : 'desc'
      }
    });
  };

  const handlePaginationChange = (current: number, pageSize: number) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        current,
        pageSize
      }
    });
  };

  const handleFilter = (values) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...values
      }
    });
  };

  return {
    data: (data && data.data) as any,
    error,
    isValidating,
    isLoading,
    mutate,
    handleTableChange,
    handleFilter,
    handlePaginationChange
  };
}
