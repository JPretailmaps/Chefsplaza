import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Page from '@components/common/layout/page';

import {
  Breadcrumb, Button, Form, Input, Select, message
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { postService } from '@services/post.service';
import Loader from '@components/common/base/loader';
import dynamic from 'next/dynamic';

const WYSIWYG = dynamic(() => import('src/wysiwyg'), {
  ssr: false
});

interface IProps {
  id: any;
}

function PostUpdate({ id }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const [post, setPost] = useState(null);
  const _content = useRef('');

  const updatePost = async () => {
    try {
      const resp = await postService.findById(id);
      _content.current = resp.data.content;
      setPost(resp.data);
    } catch (e) {
      message.error('Post not found!');
    }
  };

  useEffect(() => {
    updatePost();
  }, []);

  const submit = (data: any) => {
    try {
      setSubmiting(true);
      const submitData = {
        ...data,
        content: _content.current
      };

      postService.update(id, submitData);
      message.success('Updated successfully');
    } catch (e) {
      message.error('Something went wrong, please try again!');
      setSubmiting(false);
    } finally {
      setSubmiting(false);
    }
  };

  const contentChange = (content: string) => {
    _content.current = content;
  };
  return (
    <>
      <Head>
        <title>Update post</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/posts">
            <span>Posts</span>
          </Breadcrumb.Item>
          {post && <Breadcrumb.Item>{post.title}</Breadcrumb.Item>}
          <Breadcrumb.Item>Update</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Page>
        {!post ? (
          <Loader />
        ) : (
          <Form
            onFinish={submit}
            initialValues={post}
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

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submiting}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Page>
    </>
  );
}
PostUpdate.getInitialProps = (ctx) => {
  const { query } = ctx;
  if (!query.type) {
    query.type = 'post';
  }
  return query;
};
export default PostUpdate;
