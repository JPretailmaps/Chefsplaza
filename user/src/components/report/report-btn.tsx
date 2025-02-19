import {
  FlagOutlined
} from '@ant-design/icons';
import { IPerformer } from '@interfaces/performer';
import { Button, Modal, Tooltip } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import { IUser } from '@interfaces/user';
import style from './report-btn.module.scss';

const ReportForm = dynamic(() => (import('./report-form')), { ssr: false });

type IProps = {
  performer: IPerformer;
  target: string;
  targetId: string;
}

function ReportBtn({
  target,
  targetId,
  performer = null
}: IProps) {
  const user = useSelector((state: any) => state.user.current) as IUser;
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        disabled={!user?._id || user?.isPerformer}
        className={
          classNames(
            style['action-ico'],
            style['action-btn'],
            {
              [style.active]: openModal
            }
          )
        }
        onClick={() => setOpenModal(true)}
      >
        <Tooltip title="Report"><FlagOutlined /></Tooltip>
      </Button>
      {openModal && (
      <Modal
        key="report_btn"
        className="subscription-modal"
        title="Report Post"
        open={openModal}
        footer={null}
        destroyOnClose
        onCancel={() => setOpenModal(false)}
      >
        <ReportForm
          performer={performer}
          onClose={() => setOpenModal(false)}
          target={target}
          targetId={targetId}
        />
      </Modal>
      )}
    </>
  );
}

export default ReportBtn;
