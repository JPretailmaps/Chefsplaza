/* eslint-disable no-template-curly-in-string */
import {
  Form, Input, Button, Select, Switch, Row, Col, InputNumber
} from 'antd';
import { IUser } from 'src/interfaces';
import { AvatarUpload } from '@components/user/avatar-upload';
import getConfig from 'next/config';
import { validateMessages } from '@lib/message';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  user?: IUser;
  updating?: boolean;
  options?: {
    uploadHeaders?: any;
    avatarUploadUrl?: string;
    onAvatarUploaded?: Function;
    beforeUpload?: Function;
    avatarUrl?: string
  };
}

export function AccountForm({
  onFinish,
  user = undefined,
  updating = false,
  options = {}
}: IProps) {
  const {
    uploadHeaders, avatarUploadUrl, beforeUpload, onAvatarUploaded
  } = options;
  const { publicRuntimeConfig: config } = getConfig();
  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish.bind(this)}
      validateMessages={validateMessages}
      initialValues={
        user || {
          status: 'active',
          gender: 'male',
          roles: ['user']
        }
      }
    >
      <Row>
        <Col xs={12} md={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your first name!' },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message:
                  'First name can not contain number and special character'
              }
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your last name!' },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message:
                  'Last name can not contain number and special character'
              }
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }, {
              pattern: /^[a-zA-Z0-9]+$/g,
              message: 'Username must contain lowercase alphanumerics only'
            }, { min: 3 }]}
          >
            <Input placeholder="Unique, lowercase alphanumerics only" />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item
            name="name"
            label="Display name"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your display name!' },
              {
                pattern: /^(?=.*\S).+$/g,
                message:
                  'Display name can not contain only whitespace'
              },
              {
                min: 3,
                message: 'Display name must containt at least 3 characters'
              }
            ]}
          >
            <Input placeholder="Display name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="balance" label="Wallet Balance">
            <InputNumber type="number" min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Select.Option key="male" value="male">
                Male
              </Select.Option>
              <Select.Option key="female" value="female">
                Female
              </Select.Option>
              <Select.Option key="transgender" value="transgender">
                Transgender
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        {!user && [
          <Col xs={12} md={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                // {
                //   pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                //   message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                // },
                { required: true, message: 'Please enter your password!' }
              ]}
            >
              <Input.Password placeholder="User password" />
            </Form.Item>
          </Col>,
          <Col xs={12} md={12}>
            <Form.Item
              name="rePassword"
              label="Confirm password"
              rules={[
                { required: true, message: 'Please confirm your password!' }
              ]}
            >
              <Input.Password placeholder="Confirm user password" />
            </Form.Item>
          </Col>
        ]}
        <Col xs={12} md={12}>
          <Form.Item name="roles" label="Roles" rules={[{ required: true }]}>
            <Select mode="multiple">
              <Select.Option key="user" value="user">
                User
              </Select.Option>
              <Select.Option key="admin" value="admin">
                Admin
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option key="active" value="active">
                Active
              </Select.Option>
              <Select.Option key="inactive" value="inactive">
                Inactive
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="verifiedEmail" label="Verified Email" valuePropName="checked" help="Turn on if email account verified">
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item
            label="Avatar"
            help={`Avatar must be smaller than ${config.MAX_SIZE_IMAGE || 5}MB!`}
          >
            <AvatarUpload
              headers={uploadHeaders}
              uploadUrl={avatarUploadUrl}
              onBeforeUpload={beforeUpload}
              onUploaded={onAvatarUploaded}
              image={options?.avatarUrl}
            />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ margin: 50, textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" loading={updating}>
          Submit
        </Button>
      </div>
    </Form>
  );
}
