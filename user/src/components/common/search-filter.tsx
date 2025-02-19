import SelectPerformerDropdown from '@components/performer/common/select-performer-dropdown';
import {
  Col, DatePicker,
  Input, Row, Select
} from 'antd';
import { useRef } from 'react';
import dayjs from 'dayjs';
import style from './search-filter.module.scss';

const { RangePicker } = DatePicker;
interface IProps {
  onSubmit: Function;
  statuses?: {
    key: string;
    text?: string;
  }[];
  type?: {
    key: string;
    text?: string;
  }[];
  subscriptionTypes?: {
    key: string;
    text?: string;
  }[];
  searchWithPerformer?: boolean;
  searchWithKeyword?: boolean;
  dateRange?: boolean;
  isFree?: boolean;
}

export function SearchFilter({
  statuses = [],
  type = [],
  searchWithPerformer,
  searchWithKeyword,
  dateRange,
  isFree,
  onSubmit,
  subscriptionTypes
}: IProps) {
  const state = useRef({
    q: '',
    status: '',
    type: '',
    subscriptionType: '',
    performerId: '',
    isFree: '',
    fromDate: '',
    toDate: ''
  });

  const handleSubmit = (key: string, value: any) => {
    state.current[key] = value;
    onSubmit(state.current);
  };

  return (
    <Row className={style['search-filter']}>
      {searchWithKeyword && (
        <Col lg={8} md={8} xs={12}>
          <Input
            placeholder="Enter keyword"
            onChange={(evt) => {
              state.current = { ...state.current, q: evt.target.value };
            }}
            onPressEnter={() => handleSubmit('q', state.current.q)}
          />
        </Col>
      )}
      {statuses && statuses.length > 0 && (
        <Col lg={8} md={8} xs={12}>
          <Select
            onChange={(val) => handleSubmit('status', val)}
            style={{ width: '100%' }}
            placeholder="Select status"
            defaultValue=""
          >
            {statuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}
      {type && type.length > 0 && (
        <Col lg={8} md={8} xs={12}>
          <Select
            onChange={(val) => handleSubmit('type', val)}
            style={{ width: '100%' }}
            placeholder="Select type"
            defaultValue=""
          >
            {type.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}
      {subscriptionTypes && subscriptionTypes.length > 0 && (
        <Col lg={8} md={8} xs={12}>
          <Select
            onChange={(val) => handleSubmit('subscriptionType', val)}
            style={{ width: '100%' }}
            placeholder="Select type"
            defaultValue=""
          >
            {subscriptionTypes.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </Col>
      )}
      {searchWithPerformer && (
        <Col lg={8} md={8} xs={12}>
          <SelectPerformerDropdown
            showAll
            placeholder="Search creator here"
            style={{ width: '100%' }}
            onSelect={(val) => handleSubmit('performerId', val)}
          />
        </Col>
      )}
      {dateRange && (
        <Col lg={8} md={8} xs={12}>
          <RangePicker
            disabledDate={(current) => current > dayjs().endOf('day') || current < dayjs().subtract(10, 'years').endOf('day')}
            style={{ width: '100%' }}
            onChange={(dates: [any, any], dateStrings: [string, string]) => {
              // eslint-disable-next-line prefer-destructuring
              state.current.fromDate = dateStrings[0];
              // eslint-disable-next-line prefer-destructuring
              state.current.toDate = dateStrings[1];
              onSubmit(state.current);
            }}
          />
        </Col>
      )}
      {isFree && (
        <Col lg={8} md={8} xs={12}>
          <Select
            onChange={(val) => handleSubmit('isFree', val)}
            style={{ width: '100%' }}
            placeholder="Select type"
            defaultValue=""
          >
            <Select.Option key="" value="">
              All Type
            </Select.Option>
            <Select.Option key="free" value="true">
              Free
            </Select.Option>
            <Select.Option key="paid" value="false">
              Paid
            </Select.Option>
          </Select>
        </Col>
      )}
    </Row>
  );
}

SearchFilter.defaultProps = {
  statuses: [],
  type: [],
  subscriptionTypes: [],
  searchWithPerformer: false,
  searchWithKeyword: false,
  dateRange: false,
  isFree: false
};
