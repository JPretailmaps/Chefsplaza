import {
  Form, Button, Select, DatePicker
} from 'antd';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { SelectUserDropdown } from '@components/user/common/select-user-dropdown';
import dayjs from 'dayjs';

interface IProps {
  onFinish: Function;
  submiting: boolean;
}

export function FormSubscription({ onFinish, submiting }: IProps) {
  const [formRef] = Form.useForm();

  const setFormVal = (field: string, val: any) => {
    formRef.setFieldsValue({
      [field]: val
    });
  };

  return (
    <Form
      form={formRef}
      onFinish={onFinish.bind(this)}
      initialValues={
        {
          subscriptionType: 'free',
          userId: '',
          performerId: '',
          status: 'active',
          expiredAt: ''
        }
      }
      layout="vertical"
    >
      <Form.Item name="subscriptionType" label="Type" rules={[{ required: true, message: 'Please select type!' }]}>
        <Select>
          <Select.Option key="free" value="free">
            Free
          </Select.Option>
          {/* <Select.Option key="monthly" value="monthly">
              Monthly
            </Select.Option>
            <Select.Option key="yearly" value="yearly">
              Yearly
            </Select.Option> */}
        </Select>
      </Form.Item>
      <Form.Item
        name="userId"
        label="User"
        rules={[{ required: true, message: 'Please select a user!' }]}
      >
        <SelectUserDropdown onSelect={(val) => setFormVal('userId', val)} />
      </Form.Item>
      <Form.Item
        name="performerId"
        label="Creator"
        rules={[{ required: true, message: 'Please select a creator!' }]}
      >
        <SelectPerformerDropdown onSelect={(val) => setFormVal('performerId', val)} />
      </Form.Item>
      <Form.Item
        name="expiredAt"
        label="Expiry Date"
        rules={[{ required: true, message: 'Please input select the expiry date!' }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={(current) => current < dayjs().endOf('day')} />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select a status!' }]}>
        <Select>
          <Select.Option key="active" value="active">
            Active
          </Select.Option>
          <Select.Option key="inactive" value="inactive">
            Inactive
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 20 }}>
        <Button type="primary" htmlType="submit" loading={submiting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
