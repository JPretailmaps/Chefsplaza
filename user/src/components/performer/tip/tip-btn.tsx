import {
  DollarOutlined
} from '@ant-design/icons';
import { IPerformer } from '@interfaces/performer';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { IUser } from '@interfaces/user';
import style from './tip-btn.module.scss';

const ModalTip = dynamic(() => import('./modal-tip'), { ssr: false });

type Props = {
  performer: IPerformer;
  sessionId?: string;
  conversationId?: string;
  hideText?: boolean;
  classes?: string;
};

export function TipPerformerButton({
  performer, hideText, classes, sessionId, conversationId
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state: any) => state.user.current) as IUser;

  return (
    <>
      <Button
        disabled={!user?._id || user?.isPerformer}
        className={
          classNames(
            classes,
            style['tip-btn'],
            style['action-btn']
          )
        }
        onClick={() => setOpenModal(true)}
      >
        <DollarOutlined />
        {/* {!hideText && <span className={style.txt}>Send tip</span>} */}
        <span className="btn-sendtip">Send tip</span>
      </Button>
      {openModal && (
      <ModalTip
        onClose={() => setOpenModal(false)}
        performer={performer}
        open={openModal}
        sessionId={sessionId}
        conversationId={conversationId}
      />
      )}
    </>
  );
}

TipPerformerButton.defaultProps = {
  hideText: false,
  classes: '',
  sessionId: '',
  conversationId: ''
};

export default TipPerformerButton;
