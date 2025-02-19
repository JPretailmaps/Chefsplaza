import { IPerformer } from '@interfaces/index';
import { showError } from '@lib/utils';
import { reportService } from '@services/report.service';
import {
  Button, Form, Input, Select, message
} from 'antd';
import { useState } from 'react';

import { ImageWithFallback } from '@components/common';
import style from './report-form.module.scss';

type IProps = {
  performer: IPerformer;
  target: string;
  targetId: string;
  onClose: Function;
}

function ReportForm({
  target,
  targetId,
  performer,
  onClose
}: IProps) {
  const [submiting, setsubmiting] = useState(false);

  const onReport = async (values) => {
    try {
      setsubmiting(true);
      await reportService.create({
        ...values,
        target,
        targetId,
        performerId: performer?._id
      });
      message.success('Your report has been sent');
      onClose();
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <div className={style['report-form']}>
      {performer && (
      <div className="text-center">
        <ImageWithFallback
          options={{
            width: 100,
            height: 100,
            sizes: '20vw',
            style: { borderRadius: '50%' }
          }}
          alt="avatar"
          src={performer?.avatar || '/no-avatar.jpg'}
          fallbackSrc="/no-avatar.jpg"
        />
      </div>
      )}
      <div className="info-body">
        <Form
          name="report-form"
          onFinish={onReport}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          className="account-form"
          scrollToFirstError
          initialValues={{
            title: 'Violent or repulsive content',
            description: ''
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please select title' }
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Select>
              <Select.Option value="Violent or repulsive content" key="Violent or repulsive content">Violent or repulsive content</Select.Option>
              <Select.Option value="Hateful or abusive content" key="Hateful or abusive content">Hateful or abusive content</Select.Option>
              <Select.Option value="Harassment or bullying" key="Harassment or bullying">Harassment or bullying</Select.Option>
              <Select.Option value="Harmful or dangerous acts" key="Harmful or dangerous acts">Harmful or dangerous acts</Select.Option>
              <Select.Option value="Child abuse" key="Child abuse">Child abuse</Select.Option>
              <Select.Option value="Promotes terrorism" key="Promotes terrorism">Promotes terrorism</Select.Option>
              <Select.Option value="Spam or misleading" key="Spam or misleading">Spam or misleading</Select.Option>
              <Select.Option value="Infringes my rights" key="Infringes my rights">Infringes my rights</Select.Option>
              <Select.Option value="Others" key="Others">Others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            style={{ marginBottom: '20px' }}
          >
            <Input.TextArea placeholder="Tell us why you report?" minLength={20} showCount maxLength={100} rows={3} />
          </Form.Item>
          <Form.Item className="text-center">
            <Button
              className="primary"
              htmlType="submit"
              block
              loading={submiting}
              disabled={submiting}
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
}

export default ReportForm;
