import { Button, Modal } from 'antd';

import {
  PlayCircleOutlined, CloseOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import StreamPriceForm from '../set-price-session';

type Props = {
  initialized: boolean;
  loading: boolean;
  onStart: Function;
  onStop: Function;
};

function StartBtn({
  initialized,
  loading,
  onStart,
  onStop
}: Props) {
  const [openPriceModal, setOpen] = useState(false);
  const user = useSelector((state: any) => state.user.current);

  if (!initialized) {
    return (
      <>
        <Button
          key="start-btn"
          className="primary"
          onClick={() => setOpen(true)}
          disabled={loading}
          block
        >
          <PlayCircleOutlined />
          {' '}
          Start Broadcasting
        </Button>
        {openPriceModal && (
          <Modal
            centered
            key="update_stream"
            title="Update stream information"
            open={openPriceModal}
            footer={null}
            onCancel={() => setOpen(false)}
          >
            <StreamPriceForm
              submiting={loading}
              performer={user}
              onFinish={(payload) => {
                setOpen(false);
                onStart(payload);
              }}
            />
          </Modal>
        )}
      </>
    );
  }

  return (
    <Button
      key="start-btn"
      className="primary"
      onClick={onStop.bind(this)}
      disabled={loading}
      block
    >
      <CloseOutlined />
      {' '}
      <span>Stop Broadcasting</span>
    </Button>
  );
}

export default StartBtn;
