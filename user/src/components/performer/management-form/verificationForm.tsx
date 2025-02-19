import { ImageUpload } from '@components/file';
import { authService, performerService } from '@services/index';
import {
  Col, Form, Image, message, Row
} from 'antd';
import { useEffect, useState } from 'react';
import { IPerformer } from 'src/interfaces';
import classNames from 'classnames';
import style from './verificationForm.module.scss';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  user: IPerformer;
}

export function PerformerVerificationForm({ user }: IProps) {
  const [idImage, setIdImage] = useState('');
  const [documentImage, setDocumentImage] = useState('');

  useEffect(() => {
    if (user.documentVerification) {
      setDocumentImage(user?.documentVerification?.url);
    }
    if (user.idVerification) {
      setIdImage(user?.idVerification?.url);
    }
  }, []);

  const onFileUploaded = (type, file) => {
    if (file && type === 'idFile') {
      setIdImage(file?.response?.data.url);
    }
    if (file && type === 'documentFile') {
      setDocumentImage(file?.response?.data.url);
    }
    message.success('Photo has been uploaded!');
  };

  const documentUploadUrl = performerService.getDocumentUploadUrl();
  const headers = {
    authorization: authService.getToken()
  };
  return (
    <Form
      {...layout}
      name="nest-messages"
      labelAlign="left"
      className="account-form"
    >
      <Row>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Your government issued ID"
            className={classNames(
              style['model-photo-verification']
            )}
          >
            <div className={style['document-upload']}>
              <ImageUpload
                accept="image/*"
                headers={headers}
                uploadUrl={`${documentUploadUrl}/idVerificationId`}
                onUploaded={(f) => onFileUploaded('idFile', f)}
              />
              {idImage ? (
                <Image alt="id-img" src={idImage} style={{ height: '150px' }} />
              ) : <img src="/front-id.png" height="150px" alt="id-img" />}
            </div>
            <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
              <ul className={style['list-issued-id']}>
                <li>Government-issued ID card</li>
                <li>National Id card</li>
                <li>Passport</li>
                <li>Driving license</li>
              </ul>
            </div>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Your selfie with your ID and handwritten note"
            className={classNames(
              style['model-photo-verification']
            )}
          >
            <div className={style['document-upload']}>
              <ImageUpload
                accept="image/*"
                headers={headers}
                uploadUrl={`${documentUploadUrl}/documentVerificationId`}
                onUploaded={(f) => onFileUploaded('documentFile', f)}
              />
              {documentImage ? (
                <Image alt="id-img" src={documentImage} style={{ height: '150px' }} />
              ) : <img src="/holding-id.jpg" height="150px" alt="holding-id" />}
            </div>
            <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
              <ul className={style['list-issued-id']}>
                <li>
                  On a blank piece of white paper write your name, today&apos;s date and our website address
                  {' '}
                  {window.location.hash}
                </li>
                <li>Hold your paper and your ID so we can clearly see hoth</li>
                <li>Take a selfie of you, your ID and your handwritten note. All three elements (you, your ID and your writting) must be clearly visible without copying or editing</li>
              </ul>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default PerformerVerificationForm;
