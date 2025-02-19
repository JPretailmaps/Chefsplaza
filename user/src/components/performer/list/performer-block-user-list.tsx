import UsersBlockList from '@components/user/users-block-list';
import {
  Button, Form, Input,
  message, Modal
} from 'antd';
import { useState } from 'react';
import { blockService } from 'src/services';
import { showError } from '@lib/utils';
import { SelectUserDropdown } from '@components/user';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { useRouter } from 'next/router';
import style from './performer-block-user.module.scss';

function PerformerBlockList() {
  const [submiting, setsubmiting] = useState(false);
  const [totalBlockedUsers, setTotalBlockedUsers] = useState(0);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [formRef] = Form.useForm();

  const handleUnblockUser = async (userId: string) => {
    if (!window.confirm('Are you sure to unblock this user?')) return;
    try {
      setsubmiting(true);
      blockService.unBlockUser(userId);
      message.success('Unblocked successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const handleBlockUser = async (data) => {
    const { reason, targetId } = data;
    try {
      setsubmiting(true);
      await blockService.blockUser({ targetId, target: 'user', reason });
      message.success('User profile is blocked successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
      setOpenBlockModal(false);
    }
  };

  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const {
    data, error, isLoading, handleTableChange
  } = useClientFetch(buildUrl(blockService.performerBlockUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }
  return (
    <>
      <div className={style['block-user']}>
        <Button className="" type="primary" onClick={() => setOpenBlockModal(true)}>
          Want to block someone, click here!
        </Button>
      </div>
      <div className="users-blocked-list">
        <UsersBlockList
          items={data?.data || []}
          searching={isLoading}
          total={totalBlockedUsers}
          onPaginationChange={handleTableChange}
          pageSize={Number(pageSize)}
          submiting={submiting}
          unblockUser={(userId) => handleUnblockUser(userId)}
        />
      </div>
      {openBlockModal && (
      <Modal
        centered
        title="Block user"
        open={openBlockModal}
        onCancel={() => setOpenBlockModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={formRef}
          name="blockForm"
          onFinish={(t) => handleBlockUser(t)}
          initialValues={{ reason: '' }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="account-form"
        >
          <Form.Item name="targetId" label="Please enter the username you want to block">
            <SelectUserDropdown
              onSelect={(id) => formRef.setFieldValue('targetId', id)}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Tell us your reason' }]}
          >
            <Input.TextArea
              placeholder="Enter your reason"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="primary"
              htmlType="submit"
              loading={submiting}
              disabled={submiting}
              style={{ marginRight: '20px' }}
            >
              Submit
            </Button>
            <Button
              className="secondary"
              onClick={() => setOpenBlockModal(false)}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      )}
    </>
  );
}

export default PerformerBlockList;
