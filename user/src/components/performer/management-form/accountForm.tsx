import {
  GoogleOutlined,
  TwitterOutlined, UploadOutlined
} from '@ant-design/icons';
import { AvatarUpload } from '@components/user/avatar-upload';
import { CoverUpload } from '@components/user/cover-upload';
import {
  Button, Checkbox, Col, DatePicker,
  Form, Input, message, Modal,
  Popover, Progress, Row, Select, Upload
} from 'antd';
import getConfig from 'next/config';
import { useRef, useState } from 'react';
import { IPerformer } from 'src/interfaces';
import dayjs from 'dayjs';
import { COUNTRIES } from 'src/constants/countries';
import { performerService } from '@services/performer.service';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentUserAvatar, updateCurrentUserCover, updatePerformer } from '@redux/user/actions';
import { validateMessages } from '@lib/message';
import { authService } from '@services/auth.service';
import useCountdown from 'src/hooks/use-countdown';
import { IPerformerCategory } from '@interfaces/performer-category';
import dynamic from 'next/dynamic';
import {
  BODY_TYPES, BUTTS, ETHNICITIES, EYES, GENDERS, HAIRS, HEIGHTS, SEXUAL_ORIENTATIONS, WEIGHTS
} from 'src/constants';
import { showError } from '@lib/utils';
import style from './accountFrom.module.scss';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
  categories: IPerformerCategory[];
}

export function PerformerAccountForm({
  user, categories
}: IProps) {
  const _bio = useRef(user?.bio || '');
  const numCountdown = 60;
  const { countTime, setCountdown } = useCountdown(numCountdown);

  const { updating } = useSelector((state: any) => state.user);
  const [submiting, setSubmiting] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadVideoPercentage, setUploadVideoPercentage] = useState(0);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(user?.welcomeVideoPath || '');
  const [previewVideoName, setPreviewVideoName] = useState(user?.welcomeVideoName || '');
  const [isShowPreview, setIsShowPreview] = useState(false);
  const dispatch = useDispatch();

  const handleVideoChange = (info: any) => {
    info.file && info.file.percent && setUploadVideoPercentage(info.file.percent);
    if (info.file.status === 'uploading') {
      setIsUploadingVideo(true);
      return;
    }
    if (info.file.status === 'done') {
      message.success('Intro video was uploaded');
      setIsUploadingVideo(false);
      setPreviewVideoUrl(info?.file?.response?.data.url);
      setPreviewVideoName(info?.file?.response?.data.name);
    }
  };

  const beforeUploadVideo = (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const isValid = file.size / 1024 / 1024 < (config.MAX_SIZE_TEASER || 200);
    if (!isValid) {
      message.error(`File is too large please provide an file ${config.MAX_SIZE_TEASER || 200}MB or below`);
      return false;
    }
    setPreviewVideoName(file.name);
    return true;
  };

  const onAvatarUploaded = (data: any) => {
    message.success('Changes saved');
    dispatch(updateCurrentUserAvatar(data.response.data.url));
  };

  const onCoverUploaded = (data: any) => {
    message.success('Changes saved');
    dispatch(updateCurrentUserCover(data.response.data.url));
  };

  const verifyEmail = async () => {
    try {
      setSubmiting(true);
      const resp = await authService.verifyEmail({
        sourceType: 'performer',
        source: { _id: user._id, email: user.email }
      });
      setCountdown(numCountdown);
      resp.data && resp.data.message && message.success(resp.data.message);
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const submit = (data: any) => {
    dispatch(updatePerformer({
      ...user,
      ...data
    }));
  };

  const { publicRuntimeConfig: config } = getConfig();

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(val) => submit(val)}
      validateMessages={validateMessages}
      initialValues={{
        ...user,
        dateOfBirth: (user.dateOfBirth && dayjs(user.dateOfBirth)) || ''
      }}
      scrollToFirstError
      className="account-form"
    >
      <div
        className={style['top-profile']}
        style={{
          position: 'relative',
          marginBottom: 25,
          backgroundImage:
            user?.cover
              ? `url('${user.cover}')`
              : "url('/default-banner.jpeg')"
        }}
      >
        <div className={style['avatar-upload']}>
          <AvatarUpload
            uploadUrl={performerService.getAvatarUploadUrl()}
            onUploaded={onAvatarUploaded}
            image={user.avatar}
          />
        </div>
        <div className={style['cover-upload']}>
          <CoverUpload
            uploadUrl={performerService.getCoverUploadUrl()}
            onUploaded={onCoverUploaded}
            image={user.cover}
            options={{ fieldName: 'cover' }}
          />
        </div>
      </div>
      <Row>
        <Col md={12} xs={24}>
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
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
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
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="name"
            label="Display Name"
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
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="username"
            label="Username"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your username!' },
              {
                pattern: /^[a-z0-9]+$/g,
                message:
                  'Username must contain lowercase alphanumerics only'
              },
              { min: 3, message: 'Username must containt at least 3 characters' }
            ]}
          >
            <Input placeholder="user1, john99,..." />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="email"
            label={(
              <span style={{ fontSize: 10 }}>
                Email Address
                &nbsp;&nbsp;
                {user.verifiedEmail ? (
                  <Popover title="Your email address is verified" content={null}>
                    <a className="success-color">Verified!</a>
                  </Popover>
                ) : (
                  <Popover
                    title="Your email address is not verified"
                    content={(
                      <Button
                        className="primary"
                        onClick={() => verifyEmail()}
                        disabled={submiting || countTime < numCountdown}
                        loading={submiting || countTime < numCountdown}
                      >
                        Click here to
                        {' '}
                        {countTime < numCountdown ? 'resend' : 'send'}
                        {' '}
                        the verification link
                        {' '}
                        {countTime < numCountdown && `${countTime}s`}
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
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              { required: true, message: 'Please select your gender!' }]}
          >
            <Select>
              {GENDERS.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="categoryIds" label="Categories">
            <Select showSearch mode="multiple">
              {categories?.map((s) => (
                <Select.Option key={s._id} value={s._id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="sexualOrientation"
            label="Sexual orientation"
          >
            <Select>
              {SEXUAL_ORIENTATIONS.map((s) => (
                <Select.Option key={s.value} value={s.value}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
            >
              {COUNTRIES.map((c) => (
                <Option value={c.code} label={c.name} key={c.code}>
                  <img alt="country_flag" src={c.flag} width="25px" />
                  {' '}
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true,
                message: 'Select your date of birth'
              }
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="DD/MM/YYYY"
              format="DD/MM/YYYY"
              disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').startOf('day') && currentDate < dayjs().subtract(100, 'year').startOf('day')}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="bio"
            label="Bio"
            rules={[
              {
                required: true,
                message: 'Please enter your bio!'
              }
            ]}
            extra="Tell people something about you..."
          >
            <WYSIWYG content={_bio.current} onChange={(html) => { _bio.current = html; }} />
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
            label="Confirm new Password"
            name="confirm"
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
        <Col md={12} xs={24}>
          <Form.Item name="state" label="State">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={24} md={24} xs={24}>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="zipcode" label="Zip Code">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="ethnicity" label="Ethnicity">
            <Select>
              {ETHNICITIES.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="height" label="Height">
            <Select showSearch>
              {HEIGHTS.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="weight" label="Weight">
            <Select showSearch>
              {WEIGHTS.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="bodyType" label="Body Type">
            <Select>
              {BODY_TYPES.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="eyes" label="Eye color">
            <Select>
              {EYES.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="hair" label="Hair color">
            <Select>
              {HAIRS.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item name="butt" label="Butt size">
            <Select>
              {BUTTS.map((s) => (
                <Select.Option key={s.value} value={s.text}>
                  {s.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item label="Intro Video">
            <Upload
              accept={'video/*'}
              name="welcome-video"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={performerService.getVideoUploadUrl()}
              headers={{ authorization: authService.getToken() }}
              beforeUpload={(file) => beforeUploadVideo(file)}
              onChange={handleVideoChange}
            >
              <UploadOutlined />
            </Upload>
            <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
              {((previewVideoUrl || previewVideoName) && <a aria-hidden onClick={() => setIsShowPreview(true)}>{previewVideoName || previewVideoUrl || 'Click here to preview'}</a>)
                || (
                  <a>{`Intro video is ${config.MAX_SIZE_TEASER || 200} MB or below`}</a>
                )}
            </div>
            {uploadVideoPercentage ? (
              <Progress percent={Math.round(uploadVideoPercentage)} />
            ) : null}
          </Form.Item>
          <Form.Item name="activateWelcomeVideo" valuePropName="checked">
            <Checkbox className="black-color">Activate intro video</Checkbox>
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          {user.twitterConnected && (
            <Form.Item>
              <p className="black-color">
                <TwitterOutlined style={{ color: '#1ea2f1', fontSize: '30px' }} />
                {' '}
                Signup/login via Twitter
              </p>
            </Form.Item>
          )}
          {user.googleConnected && (
            <Form.Item>
              <p className="black-color">
                <GoogleOutlined style={{ color: '#d64b40', fontSize: '30px' }} />
                {' '}
                Signup/login via Google
              </p>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Form.Item className="text-center">
        <Button className="primary" type="primary" htmlType="submit" loading={isUploadingVideo} disabled={updating || isUploadingVideo}>
          Save Changes
        </Button>
      </Form.Item>
      {isShowPreview && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreview(false)}
          onCancel={() => setIsShowPreview(false)}
          open={isShowPreview}
          destroyOnClose
          centered
        >
          <VideoPlayer
            options={{
              autoplay: true,
              controls: true,
              playsinline: true,
              fluid: true,
              sources: [
                {
                  src: previewVideoUrl,
                  type: 'video/mp4'
                }
              ]
            }}
          />
        </Modal>
      )}
    </Form>
  );
}

export default PerformerAccountForm;
