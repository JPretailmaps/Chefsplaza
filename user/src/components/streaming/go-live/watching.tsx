import { useState } from 'react';
import { Event } from 'src/socket';
import {
  EyeOutlined
} from '@ant-design/icons';
import { STREAM_EVENT } from '../constants';

type Props = {
  conversationId: string;
};

function Watching({
  conversationId
}: Props) {
  const [t, setT] = useState(0);

  const onRoomChange = ({ total: _total, conversationId: cId }) => {
    if (conversationId === cId) {
      setT(_total);
    }
  };

  return (
    <>
      {conversationId && (
      <Event
        event={STREAM_EVENT.ROOM_INFORMATIOM_CHANGED}
        handler={onRoomChange}
      />
      )}
      <div>
        <EyeOutlined />
        <span className="number-badge">{t}</span>
      </div>
    </>
  );
}

export default Watching;
