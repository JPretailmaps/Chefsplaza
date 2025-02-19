import { PureComponent } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Switch,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Upload,
  Checkbox,
  Progress,
  Modal,
  Divider
} from 'antd';
import {
  IPerformer,
  IPerformerCategory
} from 'src/interfaces';
import { UploadOutlined } from '@ant-design/icons';
import { AvatarUpload } from '@components/user/avatar-upload';
import { CoverUpload } from '@components/user/cover-upload';
import {
  authService,
  performerService
} from '@services/index';
import Router from 'next/router';
import { VideoPlayer } from '@components/common';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import { validateMessages } from '@lib/message';
import {
  BODY_TYPES, BUTTS, COUNTRIES, ETHNICITIES, EYES, GENDERS, HAIRS, HEIGHTS, SEXUAL_ORIENTATIONS, WEIGHTS
} from 'src/constants';
import dayjs from 'dayjs';
import style from './AccountForm.module.scss';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  onBeforeUpload?: Function;
  performer?: IPerformer;
  submiting: boolean;
  categories: IPerformerCategory[];
}

export class AccountForm extends PureComponent<IProps> {
  _bio = '';

  state = {
    isUploadingVideo: false,
    uploadVideoPercentage: 0,
    previewVideoUrl: '',
    previewVideoName: '',
    isShowPreview: false,
    coverUrl: ''
  };

  componentDidMount() {
    const { performer } = this.props;
    if (performer) {
      this._bio = performer.bio;
      this.setState({
        previewVideoUrl: performer?.welcomeVideoPath || '',
        previewVideoName: performer?.welcomeVideoName || '',
        coverUrl: performer?.cover || ''
      });
    }
  }

  handleVideoChange = (info: any) => {
    info.file
      && info.file.percent
      && this.setState({ uploadVideoPercentage: info.file.percent });
    if (info.file.status === 'uploading') {
      this.setState({ isUploadingVideo: true });
      return;
    }
    if (info.file.status === 'done') {
      message.success('Intro video was uploaded');
      this.setState({
        isUploadingVideo: false,
        previewVideoUrl: info?.file?.response?.data?.url,
        previewVideoName: info?.file?.response?.data?.name
      });
    }
  };

  beforeUploadVideo = (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const isValid = file.size / 1024 / 1024
      < (config.MAX_SIZE_TEASER || 200);
    if (!isValid) {
      message.error(
        `File is too large please provide an file ${config.MAX_SIZE_TEASER || 200
        }MB or below`
      );
      return false;
    }
    this.setState({ previewVideoName: file.name });
    return true;
  };

  render() {
    const {
      performer,
      onFinish,
      submiting,
      categories,
      onBeforeUpload
    } = this.props;
    const {
      uploadVideoPercentage,
      isUploadingVideo,
      previewVideoName,
      previewVideoUrl,
      isShowPreview,
      coverUrl
    } = this.state;
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    const { publicRuntimeConfig: config } = getConfig();

    return (
      <Form
        {...layout}
        name="form-performer"
        onFinish={(val) => {
          // eslint-disable-next-line no-param-reassign
          val.bio = this._bio;
          onFinish(val);
        }}
        onFinishFailed={() => message.error('Please complete the required fields')}
        validateMessages={validateMessages}
        initialValues={
          performer
            ? {
              ...performer,
              dateOfBirth: dayjs(performer?.dateOfBirth || '')
            }
            : {
              country: 'US',
              status: 'active',
              gender: 'male',
              sexualOrientation: 'straight',
              languages: ['en'],
              dateOfBirth: '',
              verifiedEmail: false,
              verifiedAccount: false,
              verifiedDocument: false,
              isFeatured: false,
              balance: 0
            }
        }
      >
        <Row>
          <Col xs={24} md={24}>
            <div
              className={style['top-profile']}
              style={{
                position: 'relative',
                marginBottom: 25,
                backgroundImage: coverUrl
                  ? `url('${coverUrl}')`
                  : "url('/banner-image.jpg')"
              }}
            >
              <div className={style['avatar-upload']}>
                <AvatarUpload
                  headers={uploadHeaders}
                  uploadUrl={performer ? performerService.getAvatarUploadUrl(performer?._id) : ''}
                  onBeforeUpload={(f) => onBeforeUpload && onBeforeUpload(f, 'avatar')}
                  image={performer?.avatar || ''}
                />
              </div>
              <div className={style['cover-upload']}>
                <CoverUpload
                  options={{ fieldName: 'cover' }}
                  image={performer?.cover || ''}
                  headers={uploadHeaders}
                  uploadUrl={performer ? performerService.getCoverUploadUrl(performer?._id) : ''}
                  onBeforeUpload={(f) => onBeforeUpload && onBeforeUpload(f, 'cover')}
                  onUploaded={({ base64 }) => {
                    this.setState({ coverUrl: base64 });
                  }}
                />
              </div>
            </div>
          </Col>
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
              name="name"
              label="Display name"
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
              <Input placeholder="Display name" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true },
                {
                  pattern: /^[a-z0-9]+$/g,
                  message: 'Username must contain lowercase alphanumerics only'
                },
                { min: 3 }
              ]}
            >
              <Input placeholder="Unique, lowercase alphanumerics only" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', required: true }]}
            >
              <Input placeholder="Email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item name="bio" label="Bio">
              <WYSIWYG onChange={(html) => { this._bio = html; }} content={this._bio} />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="categoryIds" label="Categories">
              <Select showSearch mode="multiple">
                {categories.map((s) => (
                  <Select.Option key={s._id} value={s._id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="DD/MM/YYYY"
                format="DD/MM/YYYY"
                disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').startOf('day') || currentDate < dayjs().subtract(100, 'year').startOf('day')}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item label="Wallet Balance" name="balance">
              <InputNumber min={0} style={{ width: '100%' }} disabled />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="gender" label="Gender">
              <Select>
                {GENDERS.map((s) => (
                  <Select.Option key={s.value} value={s.value}>
                    {s.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="sexualOrientation" label="Sexual orientation">
              <Select>
                {SEXUAL_ORIENTATIONS.map((s) => (
                  <Select.Option key={s.value} value={s.value}>
                    {s.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { min: 9 },
                { max: 14 },
                {
                  pattern: /^[0-9\b\\+ ]+$/,
                  message: 'The phone number is not in the correct format'
                }
              ]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {!performer && [
            <Col xs={12} md={12}>
              <Form.Item
                key="password"
                name="password"
                label="Password"
                rules={[
                  {
                    pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                    message:
                      'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                  },
                  { required: true, message: 'Please enter your password!' }
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>,
            <Col xs={12} md={12}>
              <Form.Item
                key="rePassword"
                name="rePassword"
                label="Confirm password"
                rules={[
                  {
                    pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                    message:
                      'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                  },
                  { required: true, message: 'Please confirm your password!' }
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          ]}
          <Col xs={12} md={12}>
            <Form.Item name="country" label="Country">
              <Select showSearch>
                {COUNTRIES.map((country) => (
                  <Select.Option key={country.code} value={country.code} style={{ display: 'flex', alignItems: 'center' }}>

                    <img loading="lazy" height={20} width={20} src={country.flag} alt="flag" />
                    &nbsp;&nbsp;
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="city" label="City">
              <Input placeholder="Enter the city" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="address" label="Address">
              <Input placeholder="Enter the address" />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item name="zipcode" label="Zipcode">
              <Input placeholder="Enter the zipcode" />
            </Form.Item>
          </Col>
          <Divider>Mensurement</Divider>
          <Col xs={12} md={12}>
            <Form.Item name="ethnicity" label="Ethnicity">
              <Select>
                {ETHNICITIES.map((s) => (
                  <Select.Option key={s.value} value={s.value}>
                    {s.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
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
          <Col xs={12} md={12}>
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
          <Col xs={12} md={12}>
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
          <Col xs={12} md={12}>
            <Form.Item name="eyes" label="Eyes">
              <Select>
                {EYES.map((s) => (
                  <Select.Option key={s.value} value={s.text}>
                    {s.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
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
          <Col xs={12} md={12}>
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
          {/* <Form.Item
          name="languages"
          label="Languages"
          rules={[
            {
              type: 'array'
            }
          ]}
        >
          <Select mode="multiple">
            {languages.map((l) => (
              <Select.Option key={l.code} value={l.code}>
                {l.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
          <Divider>Advanced</Divider>
          <Col xs={12} md={6}>
            <Form.Item
              name="verifiedEmail"
              label="Verified Email?"
              valuePropName="checked"
              help="Turn on if email account verified"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="verifiedDocument"
              label="Verified ID Documents?"
              valuePropName="checked"
              help="Allow creator to start posting contents"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="verifiedAccount"
              label="Verified Account?"
              valuePropName="checked"
              help="Display verification tick beside creator name"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="isFeatured"
              label="Featured Account?"
              valuePropName="checked"
              help="Display featured tag"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
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
          {performer && (
            <Col md={12} xs={12}>
              <Form.Item label="Intro Video">
                <Upload
                  accept={'video/*'}
                  name="welcome-video"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action={performerService.getWelcomeVideoUploadUrl(
                    performer?._id
                  )}
                  headers={uploadHeaders}
                  beforeUpload={(file) => this.beforeUploadVideo(file)}
                  onChange={this.handleVideoChange.bind(this)}
                >
                  <UploadOutlined />
                </Upload>
                <div
                  className="ant-form-item-explain"
                  style={{ textAlign: 'left' }}
                >
                  {((previewVideoUrl || previewVideoName) && (
                    <a
                      aria-hidden
                      onClick={() => this.setState({ isShowPreview: true })}
                    >
                      {previewVideoName
                        || previewVideoUrl
                        || 'Click here to preview'}
                    </a>
                  )) || (
                      <a>
                        Intro video is
                        {config.MAX_SIZE_TEASER || 200}
                        MB or below
                      </a>
                    )}
                </div>
                {uploadVideoPercentage ? (
                  <Progress percent={Math.round(uploadVideoPercentage)} />
                ) : null}
              </Form.Item>
              <Form.Item name="activateWelcomeVideo" valuePropName="checked">
                <Checkbox>Activate intro video</Checkbox>
              </Form.Item>
            </Col>
          )}
        </Row>
        <div className="text-center" style={{ margin: '40px 0', display: 'flex', gap: 20 }}>
          <Button
            block
            type="primary"
            htmlType="submit"
            disabled={submiting || isUploadingVideo}
            loading={submiting || isUploadingVideo}
          >
            Submit
          </Button>
          &nbsp;
          <Button block onClick={() => Router.back()} disabled={submiting}>
            Back
          </Button>
        </div>
        {isShowPreview && (
          <Modal
            width={767}
            footer={null}
            onOk={() => this.setState({ isShowPreview: false })}
            onCancel={() => this.setState({ isShowPreview: false })}
            visible={isShowPreview}
            destroyOnClose
            centered
          >
            <VideoPlayer
              {...{
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
}
