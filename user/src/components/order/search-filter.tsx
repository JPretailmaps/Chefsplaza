import {
  Col, DatePicker,
  Row, Select
} from 'antd';
import { useRef } from 'react';
import dayjs from 'dayjs';
import style from './search-filter.module.scss';

const { RangePicker } = DatePicker;

const deliveryStatuses = [
  {
    key: 'processing',
    text: 'Processing'
  },
  {
    key: 'shipping',
    text: 'Shipping'
  },
  {
    key: 'delivered',
    text: 'Delivered'
  },
  {
    key: 'refunded',
    text: 'Refunded'
  }
];

interface IProps {
  onSubmit: Function;
}

export function OrderSearchFilter({ onSubmit }: IProps) {
  const state = useRef({
    deliveryStatus: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const handleSubmit = (key: string, value: any) => {
    state.current[key] = value;
    onSubmit(state.current);
  };

  return (
    <Row className={style['search-filter']}>
      <Col lg={6} md={8} xs={12}>
        <Select
          onChange={(val) => handleSubmit('deliveryStatus', val)}
          style={{ width: '100%' }}
          placeholder="Select delivery status"
          defaultValue=""
        >
          <Select.Option key="all" value="">
            All delivery statuses
          </Select.Option>
          {deliveryStatuses.map((s) => (
            <Select.Option key={s.key} value={s.key}>
              {s.text || s.key}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col lg={10} md={10} xs={12}>
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
    </Row>
  );
}
