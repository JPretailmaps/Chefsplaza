import { } from '@ant-design/icons';
import {
  Button,
  Col, Modal,
  Row
} from 'antd';
import { useState } from 'react';

interface IProps {
  onAddPollDuration: Function;
  openDurationPollModal: boolean;
}

export default function AddPollDurationForm({ onAddPollDuration, openDurationPollModal }: IProps) {
  const [limitTime, setLimitTime] = useState(7);

  const onChangePoll = async (value) => {
    setLimitTime(value);
  };

  if (!openDurationPollModal) return null;

  return (
    <Modal
      centered
      title={`Poll duration - ${!limitTime ? 'No limit' : `${limitTime} days`}`}
      open={openDurationPollModal}
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
