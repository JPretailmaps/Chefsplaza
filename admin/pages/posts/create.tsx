import Head from 'next/head';
import { useRef, useState } from 'react';
import Page from '@components/common/layout/page';

import {
  Breadcrumb, Button, Form, Input, Select, message
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { postService } from '@services/post.service';
import Router from 'next/router';
import dynamic from 'next/dynamic';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

interface IProps {
  type: any;
}

function PostCreate({ type }:IProps) {
  const [submiting, setSubmiting] = useState(false);
  const _content = useRef('');

  const submit = (data: any) => {
    try {
      setSubmiting(true);
      const submitData = {
        ...data,
        content: _content.current,
        type
      };

      postService.create(submitData);
      message.success('Created successfully');
      // TODO - redirect
      Router.push(
        {
          pathname: '/posts'
        },
        '/posts'
      );
    } catch (e) {
      message.error('Something went wrong, please try again!');
      setSubmiting(false);
    }
  };

  const contentChange = (content: string) => {
    _content.current = content;
  };

  return (
    <>
      <Head>
        <title>New static page</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/posts">
            <span>Static pages</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New page</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Page>
        <Form
          onFinish={submit}
          initialValues={{
            title: '',
            shortDescription: '',
            status: 'published',
            ordering: 0
          }}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item name="title" rules={[{ required: true, message: 'Please input title!' }]} label="Title">
            <Input placeholder="Enter your title" />
          </Form.Item>
          <Form.Item name="shortDescription" label="Short description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Content">
            <WYSIWYG onChange={contentChange} content={_content.current} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="published">Active</Select.Option>
              <Select.Option value="draft">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0 }}>
            <Button type="primary" htmlType="submit" disabled={submiting} loading={submiting}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Page>
    </>
  );
}
PostCreate.getInitialProps = (ctx) => {
  const { query } = ctx;
  if (!query.type) {
    query.type = 'post';
  }
  return query;
};
export default PostCreate;
