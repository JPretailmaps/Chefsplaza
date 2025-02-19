import { useState } from 'react';
import {
  Row, Button,
  Col, Modal
} from 'antd';
import { } from '@ant-design/icons';

interface IProps {
  onAddPollDuration: Function;
  openDurationPollModal: boolean;
}

export default function AddPollDurationForm(props: IProps) {
  const [limitTime, setLimitTime] = useState(7);

  const onChangePoll = (value) => {
    setLimitTime(value);
  };

  const { onAddPollDuration, openDurationPollModal = false } = props;

  return (
    <Modal
      title={`Poll duration - ${!limitTime ? 'No limit' : `${limitTime} days`}`}
      visible={openDurationPollModal}
      onCancel={() => onAddPollDuration(7)}
      onOk={() => onAddPollDuration(limitTime)}
    >
      <Row>
        <Col span={4.5}>
          <Button type={limitTime === 1 ? 'primary' : 'default'} onClick={() => onChangePoll(1)}>1 day</Button>
        </Col>
        <Col span={4.5}>
          <Button type={limitTime === 3 ? 'primary' : 'default'} onClick={() => onChangePoll(3)}>3 days</Button>
        </Col>
        <Col span={4.5}>
          <Button type={limitTime === 7 ? 'primary' : 'default'} onClick={() => onChangePoll(7)}>7 days</Button>
        </Col>
        <Col span={4.5}>
          <Button type={limitTime === 30 ? 'primary' : 'default'} onClick={() => onChangePoll(30)}>30 days</Button>
        </Col>
        <Col span={6}>
          <Button type={limitTime === 0 ? 'primary' : 'default'} onClick={() => onChangePoll(0)}>No limit</Button>
        </Col>
      </Row>
    </Modal>
  );
}
