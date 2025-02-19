import { GoogleOutlined, TwitterOutlined } from '@ant-design/icons';
import { AvatarUpload } from '@components/user/avatar-upload';
import { showError } from '@lib/utils';
import { updateCurrentUserAvatar, updateUser } from '@redux/user/actions';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import {
  Button, Col, Form, Input, Popover, Row, Select, message
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './account-form.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

function UserAccountFormComponent() {
  const { current: user, updating } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [countTime, setCountTime] = useState(60);
  const countRef = useRef() as any;

  const onFinish = (data) => {
    dispatch(updateUser(data));
  };

  const uploadAvatar = (data) => {
    dispatch(updateCurrentUserAvatar(data.response.data.url));
  };

  const handleCountdown = () => {
    if (countTime === 0) {
      setCountTime(60);
      countRef.current && clearTimeout(countRef.current);
      return;
    }
    setCountTime((s) => s - 1);
    countRef.current = setTimeout(() => handleCountdown, 1000);
  };

  const verifyEmail = async () => {
    try {
      const resp = await authService.verifyEmail({
        sourceType: 'user',
        source: user
      });
      handleCountdown();
      message.success(resp.data.message);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => () => { countRef.current && clearTimeout(countRef.current); }, [countTime]);

  return (
    <Form
      className={style['account-form']}
      {...layout}
      name="user-account-form"
      onFinish={(data) => onFinish(data)}
      scrollToFirstError
      initialValues={user}
    >
      <Row>
        <Col xs={24} sm={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your first name!' },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message: 'First name can not contain number and special character'
              }
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your last name!' },
              {
                pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                message: 'Last name can not contain number and special character'
              }
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="username"
            label="Username"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your username!' },
              {
                pattern: /^[a-zA-Z0-9]+$/g,
                message: 'Username must contain lowercase alphanumerics only'
              },
              { min: 3, message: 'Username must containt at least 3 characters' }
            ]}
          >
            <Input placeholder="mirana, invoker123, etc..." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="email"
            label={(
              <span style={{ fontSize: 10 }}>
                Email Address
                {'  '}
                {user.verifiedEmail ? (
                  <Popover title="Your email address is verified" content={null}>
                    <a className="success-color">Verified!</a>
                  </Popover>
                ) : (
                  <Popover
                    title="Your email address is not verified"
                    content={(
                      <Button
                        type="primary"
                        onClick={() => verifyEmail()}
                        disabled={!user.email || countTime < 60}
                        loading={countTime < 60}
                      >
                        Click here to
                        {' '}
                        {countTime < 60 ? 'resend' : 'send'}
                        {' '}
                        the verification link
                        {' '}
                        {countTime < 60 && `${countTime}s`}
                      </Button>
                    )}
                  >
                    <a className="error-color">Not verified!</a>
                  </Popover>
                )}
              </span>
            )}
            rules={[{ type: 'email' }, { required: true, message: 'Please input your email address!' }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input placeholder="Email Address" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="name"
            label="Display Name"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your display name!' },
              {
                pattern: /^(?=.*\S).+$/g,
                message: 'Display name can not contain only whitespace'
              },
              {
                min: 3,
                message: 'Display name must containt at least 3 characters'
              }
            ]}
          >
            <Input placeholder="Display Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select>
              <Select.Option value="male" key="male">
                Male
              </Select.Option>
              <Select.Option value="female" key="female">
                Female
              </Select.Option>
              <Select.Option value="transgender" key="transgender">
                Transgender
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
              }
            ]}
          >
            <Input.Password placeholder="Enter new password here" />
          </Form.Item>
          <p
            className="text-center"
            style={{ fontSize: '10px', fontWeight: 'lighter' }}
          >
            Keep it blank for current password
          </p>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label="Confirm new password"
            name="confirm-password"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Passwords do not match together!');
                }
              })
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Avatar">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <AvatarUpload
                image={user.avatar}
                uploadUrl={userService.getAvatarUploadUrl()}
                onUploaded={uploadAvatar}
              />
            </div>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          {user.twitterConnected && (
            <Form.Item>
              <p className="primary-color">
                <TwitterOutlined style={{ color: '#1ea2f1', fontSize: '30px' }} />
                {' '}
                Signup/login via Twitter
              </p>
            </Form.Item>
          )}
          {user.googleConnected && (
            <Form.Item>
              <p className="primary-color">
                <GoogleOutlined style={{ color: '#d64b40', fontSize: '30px' }} />
                {' '}
                Signup/login via Google
              </p>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Form.Item className="text-center">
        <Button htmlType="submit" className="primary" loading={updating}>
          Update Profile
        </Button>
      </Form.Item>
    </Form>
  );
}

export default UserAccountFormComponent;
