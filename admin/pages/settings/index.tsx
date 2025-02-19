/* eslint-disable jsx-a11y/label-has-associated-control */
import Head from 'next/head';
import {
  createRef, useEffect, useRef, useState
} from 'react';
import {
  Form, Menu, message, Button, Input,
  InputNumber, Switch, Checkbox, Radio, Divider
} from 'antd';
import Page from '@components/common/layout/page';
import { settingService } from '@services/setting.service';
import { ISetting } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { ImageUpload } from '@components/file/image-upload';
import { authService } from '@services/auth.service';
import dynamic from 'next/dynamic';
import { PaymentSettingsForm } from '@components/setting/payment-settings';
import { showError } from '@lib/message';
import style from './index.module.scss';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

function Settings() {
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('general');
  const [list, setList] = useState([]);
  const [freeSubscriptionEnabled, setFreeEnabled] = useState(true);

  const [formRef] = Form.useForm();

  const dataChange = useRef({}) as any;
  const smtpInfo = useRef({
    host: '',
    port: '',
    secure: true,
    auth: {
      user: '',
      password: ''
    }
  }) as any;

  useEffect(() => {
    loadSettings();
  }, [selectedTab]);

  const setVal = (field: string, val: any) => {
    dataChange.current[field] = val;
    if (field === 'freeSubscriptionEnabled') {
      setFreeEnabled(val);
    }
  };

  const handleTextEditerContentChange = async (key: string, content: string) => {
    setVal(key, content);
  };

  const onMenuChange = async (menu) => {
    setSelectedTab(menu.key);
  };

  const setObject = (field: string, val: any) => {
    if (field === 'user' || field === 'pass') {
      smtpInfo.current.auth[field] = val;
    } else {
      smtpInfo.current[field] = val;
    }

    dataChange.current.smtpTransporter = smtpInfo.current;
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      const resp = (await settingService.all(selectedTab)) as any;
      dataChange.current = {};
      if (selectedTab === 'mailer' && resp.data && resp.data.length) {
        const info = resp.data.find((data) => data.key === 'smtpTransporter');
        if (info) {
          smtpInfo.current = info.value;
        }
      }
      const isFreeSubscription = resp.data.find((s) => s.key === 'freeSubscriptionEnabled');
      setList(resp.data);
      setFreeEnabled(!!isFreeSubscription?.value);
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    try {
      setUpdating(true);
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(dataChange.current)) {
        if (key.indexOf('commission') !== -1) {
          if (!dataChange.current[key]) {
            message.error('Missing commission value!');
            return;
          }
          if (Number.isNaN(dataChange.current[key])) {
            message.error('Commission must be a number!');
            return;
          }
          if (dataChange.current[key] <= 0 || dataChange.current[key] >= 1) {
            message.error('Commission must be greater than 0 and smaller than 1!');
            return;
          }
        }
        // eslint-disable-next-line no-await-in-loop
        await settingService.update(key, dataChange.current[key]);
      }
      message.success('Updated setting successfully');
    } catch (e) {
      showError(e);
    } finally {
      setUpdating(false);
    }
  };

  const verifyMailer = async () => {
    try {
      setUpdating(true);
      const resp = await settingService.verifyMailer();
      if (resp.data.hasError) {
        message.error(JSON.stringify(resp.data.error || 'Could not verify this SMTP transporter'));
        return;
      }
      message.success('We\'ve sent and test email, please check your email inbox or spam folder');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(err ? JSON.stringify(err) : 'Could not verify this SMTP transporter');
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      setUpdating(false);
    }
  };

  const renderUpload = (setting: ISetting, ref: any) => {
    if (!setting.meta || !setting.meta.upload) {
      return null;
    }
    const uploadHeaders = {
      authorization: authService.getToken()
    };
    return (
      <div style={{ padding: '10px 0' }} key={`upload${setting._id}`}>
        <ImageUpload
          image={setting.value}
          uploadUrl={settingService.getFileUploadUrl()}
          headers={uploadHeaders}
          onUploaded={(resp) => {
            // eslint-disable-next-line no-param-reassign
            ref.current.input.value = resp.response.data.url;
            formRef.setFieldsValue({
              [setting.key]: resp.response.data.url
            });
            dataChange.current[setting.key] = resp.response.data.url;
          }}
        />
      </div>
    );
  };

  const renderFormItem = (setting: ISetting) => {
    // eslint-disable-next-line prefer-const
    let { type } = setting;
    if (setting.meta && setting.meta.textarea) {
      type = 'textarea';
    }
    const ref = createRef() as any;
    switch (type) {
      case 'textarea':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description} extra={setting.extra}>
            <Input.TextArea defaultValue={setting.value} onChange={(val) => setVal(setting.key, val.target.value)} />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item style={setting.key === 'freeSubscriptionDuration' && !freeSubscriptionEnabled ? { display: 'none' } : null} label={setting.name} key={setting._id} help={setting.description} extra={setting.extra}>
            <InputNumber
              style={{ width: '100%' }}
              defaultValue={setting.value}
              onChange={(val) => setVal(setting.key, val)}
              min={(setting.meta && typeof setting.meta.min === 'number') ? setting.meta.min : Number.MIN_SAFE_INTEGER}
              max={(setting.meta && typeof setting.meta.max === 'number') ? setting.meta.max : Number.MAX_SAFE_INTEGER}
              step={(setting.meta && typeof setting.meta.step === 'number') ? setting.meta.step : 1}
            />
          </Form.Item>
        );
      case 'text-editor':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description}>
            <WYSIWYG onChange={(html) => handleTextEditerContentChange(setting.key, html)} content={dataChange.current[setting.key] || setting?.value} />
          </Form.Item>
        );
      case 'boolean':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description} extra={setting.extra} valuePropName="checked">
            <Switch defaultChecked={setting.value} onChange={(val) => setVal(setting.key, val)} />
          </Form.Item>
        );
      case 'mixed':
        return (
          <div className="ant-row ant-form-item ant-form-item-with-help" key={setting._id} style={{ margin: '15px 0' }}>
            <div className="ant-col ant-col-24 ant-form-item-label">
              <label>
                {setting.name}
              </label>
            </div>
            <div className="ant-col ant-col-24 ant-form-item-control">
              <div className="ant-form-item">
                <div>
                  <label>
                    Host
                  </label>
                  <Input
                    defaultValue={setting?.value?.host}
                    onChange={(val) => setObject('host', val.target.value)}
                  />
                </div>
                <div>
                  <label>Port</label>
                  <Input
                    defaultValue={setting?.value?.port}
                    onChange={(val) => setObject('port', val.target.value)}
                  />
                </div>
                <div style={{ margin: '10px 0' }}>
                  <label>
                    <Checkbox defaultChecked={setting?.value?.secure} onChange={(e) => setObject('secure', e.target.checked)} />
                    {' '}
                    Secure (true for port 465, false for other ports)
                  </label>
                </div>
                <div>
                  <label>Auth user</label>
                  <Input
                    defaultValue={setting?.value?.auth?.user}
                    onChange={(val) => setObject('user', val.target.value)}
                  />
                </div>
                <div>
                  <label>Auth password</label>
                  <Input
                    defaultValue={setting?.value?.auth?.pass}
                    onChange={(val) => setObject('pass', val.target.value)}
                  />
                </div>
              </div>
              {setting.description && <div className="ant-form-item-explain">{setting.description}</div>}
              <div>
                <Button disabled={updating} loading={updating} onClick={verifyMailer} type="link">Once saved, click here to send a test email.</Button>
              </div>
            </div>
          </div>
        );
      case 'radio':
        return (
          <Form.Item label={setting.name} key={setting._id} help={setting.description} extra={setting.extra}>
            <Radio.Group onChange={(val) => setVal(setting.key, val.target.value)} defaultValue={setting.value}>
              {setting.meta?.value.map((v: any) => (
                <Radio value={v.key} key={v.key}>
                  {v.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
      case 'hr': case 'divider':
        return (
          <Form.Item>
            <Divider>{setting.name}</Divider>
          </Form.Item>
        );
      default:
        return (
          <Form.Item key={setting._id} help={setting.description} extra={setting.extra}>
            <Input
              defaultValue={setting.value}
              ref={ref}
              key={`input${setting._id}`}
              onChange={(val) => setVal(setting.key, val.target.value)}
            />
            {renderUpload(setting, ref)}
          </Form.Item>
        );
    }
  };

  const initialValues = {} as any;
  list.forEach((item: ISetting) => {
    initialValues[item.key] = item.value;
  });

  return (
    <>
      <Head>
        <title>Site Settings</title>
      </Head>
      <Page>
        <Menu
          className={`${style['menu-items']} ${style['menu-settings']}`}
          onClick={onMenuChange}
          selectedKeys={[selectedTab]}
          mode="horizontal"
        >
          <Menu.Item key="general">General</Menu.Item>
          <Menu.Item key="email">Email</Menu.Item>
          <Menu.Item key="mailer">SMTP</Menu.Item>
          <Menu.Item key="custom">SEO</Menu.Item>
          <Menu.Item key="commission">Commission</Menu.Item>
          <Menu.Item key="pricing">Pricing</Menu.Item>
          {/* <Menu.Item key="s3">S3</Menu.Item> */}
          <Menu.Item key="agora">Agora Live</Menu.Item>
          <Menu.Item key="paymentGateways">Payment Gateways</Menu.Item>
          <Menu.Item key="socials">Socials Login</Menu.Item>
          <Menu.Item key="analytics">GG Analytics</Menu.Item>
        </Menu>

        {loading ? (
          <Loader />
        ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {selectedTab === 'paymentGateways' ? <PaymentSettingsForm settings={list} /> : (
              <Form
                {...layout}
                layout="horizontal"
                name="setting-frm"
                onFinish={submit}
                initialValues={initialValues}
                form={formRef}
              >
                {list.map((setting) => renderFormItem(setting))}
                <div style={{ margin: 30, height: 40 }} className="text-center">
                  <Button type="primary" style={{ width: 200 }} htmlType="submit" disabled={updating} loading={updating}>
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </>
        )}
      </Page>
    </>
  );
}

export default Settings;
