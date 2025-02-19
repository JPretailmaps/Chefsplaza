import Loader from '@components/common/base/loader';
import dynamic from 'next/dynamic';
import Page from '@components/common/layout/page';
import { emailTemplateService } from '@services/email-template.service';
import {
  Breadcrumb, Button, Form, Input, Select, message
} from 'antd';
import Head from 'next/head';
import { HomeOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

interface IProps {
  id: any;
}

function EmailTemplateUpdate({ id }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [template, setTemplate] = useState(null);
  const _content = useRef('');
  const submit = (data: any) => {
    try {
      setSubmiting(true);
      const submitData = {
        ...data,
        content: _content.current
      };

      emailTemplateService.update(id, submitData);
      message.success('Updated successfully');
      setSubmiting(false);
    } catch (e) {
      message.error('Something went wrong, please try again!');
      setSubmiting(false);
    }
  };

  const contentChange = (content: string) => {
    _content.current = content;
  };

  const getItem = async () => {
    try {
      const resp = await emailTemplateService.findById(id);
      _content.current = resp.data.content;
      setTemplate(resp.data);
    } catch (e) {
      message.error('Email template not found!');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  return (
    <>
      <Head>
        <title>Update template</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/email-templates">
            <span>Email templates</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{template?.name}</Breadcrumb.Item>
          <Breadcrumb.Item>Update</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Page>
        {!template || fetching ? (
          <Loader />
        ) : (
          <Form
            onFinish={submit}
            initialValues={template}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item
              name="subject"
              rules={[{ required: true, message: 'Please enter subject!' }]}
              label="Subject"
            >
              <Input placeholder="Enter your title" />
            </Form.Item>

            <Form.Item label="Content">
              <WYSIWYG onChange={contentChange} content={_content.current} />
              <p><i>{template?.description}</i></p>
            </Form.Item>
            <Form.Item
              name="layout"
              label="Layout"
            >
              <Select>
                <Select.Option value="layouts/default">Default</Select.Option>
                <Select.Option value="blank">Blank</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={submiting}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Page>
    </>
  );
}

EmailTemplateUpdate.getInitialProps = (ctx) => {
  const { query } = ctx;
  return query;
};

export default EmailTemplateUpdate;
