import { HomeOutlined } from '@ant-design/icons';
import Page from '@components/common/layout/page';
import {
  Breadcrumb,
  Button,
  Form, Input,
  InputNumber,
  message
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
// import { performerCategoryService } from '@services/perfomer-category.service';
import Router from 'next/router';
import { performerCategoryService } from '@services/perfomer-category.service';
import { showError } from '@lib/message';

interface IFormValue {
  name: string;
  slug: string;
  ordering: number;
  description: string;
}

function CategoryCreate() {
  const [submiting, setSubmiting] = useState(false);

  const submit = async (data) => {
    try {
      setSubmiting(true);
      await performerCategoryService.create(data);
      message.success('Created successfully');
      // TODO - redirect
      Router.push('/creator-category');
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <>
      <Head>
        <title>New category</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/creator-category">
              Categories
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New category</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Page>
        <Form
          onFinish={submit}
          initialValues={
              {
                name: '',
                slug: '',
                ordering: 0,
                description: ''
              } as IFormValue
            }
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item name="name" rules={[{ required: true, message: 'Please input name!' }]} label="Name">
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item name="slug" label="Friendly Slug">
            <Input />
          </Form.Item>

          <Form.Item name="ordering" label="Ordering">
            <InputNumber />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" style={{ marginBottom: '30px' }} loading={submiting}>
              Submit
            </Button>
          </div>
        </Form>
      </Page>
    </>
  );
}

export default CategoryCreate;
