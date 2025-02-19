import {
  EditOutlined
} from '@ant-design/icons';
import { IStream } from '@interfaces/stream';
import { showError } from '@lib/utils';
import { streamService } from '@services/stream.service';
import {
  Button, Card, Col, Row
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useRef, useState } from 'react';

type Props = {
  stream: IStream;
};

function EditStream({
  stream
}: Props) {
  const [s, setStream] = useState(stream);
  const [edit, setEdit] = useState(false);
  const descriptionRef = useRef() as any;

  const editStream = async () => {
    const description = descriptionRef.current.value;
    try {
      if (!stream) return;
      await streamService.editLive(stream._id, { description });
      const newData = {
        ...stream, description
      };
      setStream(newData);
    } catch (e) {
      showError(e);
    } finally {
      setEdit(false);
    }
  };

  const getStream = () => {
    setStream(stream);
  };

  useEffect(() => {
    getStream();
  }, [stream]);

  return (
    <div>
      {s?.description && (
      <div className="page-streaming-bottom">
        <h3>{s?.title}</h3>
        {edit ? (
          <Row>
            <Col xs={24}>
              <textarea className="ant-input" ref={descriptionRef} defaultValue={s.description} style={{ width: '100%', margin: '5px 0' }} />
            </Col>
            <Col xs={24}>
              <Button className="primary" icon={<EditOutlined />} onClick={editStream}>Update</Button>
            </Col>
          </Row>
        ) : (
          <>
            {s.description}
            {' '}
            <EditOutlined onClick={() => setEdit(true)} />
          </>
        )}
      </div>
      )}
    </div>
  );
}

export default EditStream;
