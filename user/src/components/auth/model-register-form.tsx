import { ImageUploadModel } from '@components/file';
import { showError } from '@lib/utils';
import { authService } from '@services/auth.service';
import {
  Button, Col, DatePicker, Form, Input, message,
  Row, Select
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { COUNTRIES } from 'src/constants/countries';
import dayjs from 'dayjs';

import { IPerformerCategory } from '@interfaces/performer-category';
import classNames from 'classnames';
import { block } from 'sharp';
import style from './model-register-form.module.scss';

const { Option } = Select;

const mapStatesToProps = (state: any) => ({
  siteName: state.ui.siteName
});

const connector = connect(mapStatesToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface P extends PropsFromRedux {
  categories: IPerformerCategory[]
}

function ModelRegisterForm({
  siteName,
  categories
}: P) {
  const router = useRouter();
  const idFile = useRef(null);
  const documentFile = useRef(null);
  const [loading, setLoading] = useState(false);

  const onFileReaded = (file: File, type: string) => {
    if (file && type === 'idFile') {
      // this.idVerificationFile = file;
      idFile.current = file;
    }
    if (file && type === 'documentFile') {
      // this.documentVerificationFile = file;
      documentFile.current = file;
    }
  };

  const register = async (values: any) => {
    try {
      const data = values;
      if (!idFile.current || !documentFile.current) {
        message.error('ID documents are required!');
        return;
      }
      const verificationFiles = [{
        fieldname: 'idVerification',
        file: idFile.current
      }, {
        fieldname: 'documentVerification',
        file: documentFile.current
      }];
      setLoading(true);
      const resp = await authService.registerPerformer(verificationFiles, data, () => { });
      const { data: respData } = resp as any;

      message.success(
        <div className="text-center">
          <h4>{`Thank you for applying to be a ${siteName} creator!`}</h4>
          <p>
            {respData?.message
              || 'Your application will be processed within 24 to 48 hours, most times sooner. You will get an email notification sent to your email address with the status update.'}
          </p>
        </div>,
        15
      );
      router.push({
        pathname: '/auth/login',
        href: '/'
      });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style['main-container-creator']}>
      <div className={classNames(style['register-box'])}>
        <Form
          name="creator_register"
          initialValues={{
            gender: 'female',
            country: 'US',
            dateOfBirth: ''
          }}
          onFinish={register}
          scrollToFirstError
        >
          <div className={style['form-creator-signup']}>
            <div className={style['content-left']}>
              <img
                src="/logosignup488.png"
                alt="img-placeholding"
                style={{
                  width: '100%', height: '90%', position: 'relative', bottom: '9%'
                }}
              />
            </div>

            <div className={style['content-right']}>
              {/* <div className={style['form-fields']}>
                <Form.Item
                  name="firstName"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please input your first name!' },
                    {
                      pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                      message: 'First name cannot contain numbers or special characters'
                    }
                  ]}
                >
                  <Input placeholder="First name" />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please input your last name!' },
                    {
                      pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                      message: 'Last name cannot contain numbers or special characters'
                    }
                  ]}
                >
                  <Input placeholder="Last name" />
                </Form.Item>

                <Form.Item
                  name="name"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please input your display name!' },
                    {
                      pattern: /^(?=.*\S).+$/g,
                      message: 'Display name cannot contain only whitespace'
                    },
                    {
                      min: 3,
                      message: 'Display name must contain at least 3 characters'
                    }
                  ]}
                >
                  <Input placeholder="Display name" />
                </Form.Item>

                <Form.Item
                  name="username"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please input your username!' },
                    {
                      pattern: /^[a-z0-9]+$/g,
                      message: 'Username must contain only lowercase alphanumerics!'
                    },
                    { min: 3, message: 'Username must contain at least 3 characters' }
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>

                <Form.Item
                  name="email"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not a valid E-mail!'
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!'
                    }
                  ]}
                >
                  <Input placeholder="Email address" />
                </Form.Item>

                <Form.Item
                  name="dateOfBirth"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[{ required: true, message: 'Select your date of birth' }]}
                >
                  <DatePicker
                    placeholder="Date of Birth (DD/MM/YYYY)"
                    format="DD/MM/YYYY"
                    disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').startOf('day')
                        && currentDate < dayjs().subtract(100, 'year').startOf('day')}
                  />
                </Form.Item>

                <Form.Item name="country" rules={[{ required: true }]}>
                  <Select showSearch optionFilterProp="label" placeholder="Country">
                    {COUNTRIES.map((c) => (
                      <Option value={c.code} key={c.code} label={c.name}>
                        <img alt="country_flag" src={c.flag} width="25px" />
                        {' '}
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="gender"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[{ required: true, message: 'Please select your gender' }]}
                >
                  <Select placeholder="Gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="transgender">Transgender</Option>
                  </Select>
                </Form.Item>

                {categories.length > 0 && (
                <Form.Item
                  name="categoryIds"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[{ required: true, message: 'Please select your categories' }]}
                >
                  <Select showSearch mode="multiple" placeholder="Select your categories">
                    {categories.map((s) => (
                      <Select.Option key={s._id} value={s._id}>
                        {s.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                )}

                <Form.Item
                  name="password"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                      message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                    },
                    { required: true, message: 'Please input your password!' }
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  dependencies={['password']}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please enter confirm password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match together!'));
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="Confirm password" />
                </Form.Item>
              </div> */}
              <Col xs={24} sm={12} md={14} lg={20}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        { required: true, message: 'Please input your name!' },
                        {

                          pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                          message: 'First name can not contain number and special character'
                        }
                      ]}
                    >
                      <Input placeholder="First name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        { required: true, message: 'Please input your name!' },
                        {

                          pattern: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                          message: 'Last name can not contain number and special character'
                        }
                      ]}
                    >
                      <Input placeholder="Last name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="name"
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
                  <Col span={12}>
                    <Form.Item
                      name="username"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        { required: true, message: 'Please input your username!' },
                        {

                          pattern: /^[a-z0-9]+$/g,
                          message: 'Username must contain only lowercase alphanumerics only!'
                        },
                        { min: 3, message: 'username must containt at least 3 characters' }
                      ]}
                    >
                      <Input placeholder="Username" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!'
                        },
                        {
                          required: true,
                          message: 'Please input your E-mail!'
                        }
                      ]}
                    >
                      <Input className={style['register-input']} placeholder="Email address" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
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
                        placeholder="Date of Birth (DD/MM/YYYY)"
                        format="DD/MM/YYYY"
                        disabledDate={(currentDate) => currentDate > dayjs().subtract(18, 'year').startOf('day') && currentDate < dayjs().subtract(100, 'year').startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="country" rules={[{ required: true }]}>
                      <Select showSearch optionFilterProp="label">
                        {COUNTRIES.map((c) => (
                          <Option value={c.code} key={c.code} label={c.name}>
                            <img alt="country_flag" src={c.flag} width="25px" />
                            {' '}
                            {c.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="gender"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: true, message: 'Please select your gender' }]}
                    >
                      <Select>
                        <Option value="male" key="male">
                          Male
                        </Option>
                        <Option value="female" key="female">
                          Female
                        </Option>
                        <Option value="transgender" key="trans">
                          Trans
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {categories.length > 0 && (
                  <Col span={12} className={style['category-field']}>
                    <Form.Item
                      name="categoryIds"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[{ required: true, message: 'Please select your categories' }]}
                    >
                      <Select showSearch mode="multiple" placeholder="Favorite Kitchen">
                        {categories.map((s) => (
                          <Select.Option key={s._id} value={s._id}>
                            {s.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  )}
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {

                          pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g,
                          message:
                          'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
                        },
                        { required: true, message: 'Please input your password!' }
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="confirm"
                      dependencies={['password']}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter confirm password!'
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match together!'));
                          }
                        })
                      ]}
                    >
                      <Input.Password placeholder="Confirm password" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <div className={style['upload-grp']}>
                <Form.Item>
                  <div className={style['upload-file']}>
                    <ImageUploadModel onFileReaded={(f) => onFileReaded(f, 'idFile')} />
                    <p className={style['text-upload-warning']}>Upload your Government issued ID Cart, National ID Card, Passport or Drivers License</p>
                  </div>
                </Form.Item>
                <Form.Item>
                  <div className={style['upload-file']}>
                    <ImageUploadModel onFileReaded={(f) => onFileReaded(f, 'documentFile')} />
                    <p className={style['text-upload-warning']}>Upload a selife with your ID in your hand</p>

                  </div>
                </Form.Item>
              </div>

              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  htmlType="submit"
                  disabled={loading}
                  loading={loading}
                  className={style['form-button']}
                >
                  CREATE YOUR ACCOUNT
                </Button>
              </Form.Item>

              <div className={style['text-center']}>
                <p>
                  By signing up you agree with our
                  {' '}
                  <Link href="/page/terms-of-service" target="_blank">Terms of Service</Link>
                  {' '}
                  and
                  {' '}
                  <Link href="/page/privacy-policy" target="_blank">Privacy Policy</Link>
                </p>
                <p>
                  Already have an account, sign in here
                  {' '}
                  <Link href="/auth/login">Log in here.</Link>
                </p>
                <p>
                  Are you a fan?
                  {' '}
                  <Link href="/auth/fan-register">Sign up here.</Link>
                </p>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default connector(ModelRegisterForm);
