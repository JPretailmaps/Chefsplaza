import { HomeOutlined } from '@ant-design/icons';
import Loader from '@components/common/base/loader';
import Page from '@components/common/layout/page';
import { performerCategoryService } from '@services/perfomer-category.service';
import {
  Breadcrumb,
  Button,
  Form, Input,
  InputNumber,
  message
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IFormValue {
  name: string;
  slug: string;
  ordering: number;
  description: string;
}
// eslint-disable-next-line react/prop-types
function CategoryUpdate({ id }) {
  const [submiting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(null);

  const submit = async (data: any) => {
    try {
      setSubmitting(true);

      const submitData = {
        ...data
      };
      await performerCategoryService.update(id, submitData);
      message.success('Updated successfully');
      setSubmitting(false);
    } catch (e) {
      // TODO - check and show error here
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const resp = await performerCategoryService.findById(id);
        setCategory(resp.data);
      } catch (e) {
        message.error('Category not found!');
      }
    };
    getCategory();
  }, [id]);

  return (
    <>
      <Head>
        <title>Update category</title>
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
            {/* <span>Categories</span> */}
          </Breadcrumb.Item>
          {category && <Breadcrumb.Item>{category.name}</Breadcrumb.Item>}
          <Breadcrumb.Item>Update</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Page>
        {!category ? (
          <Loader />
        ) : (
          <Form
            onFinish={submit}
            initialValues={category as IFormValue}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input name!' }]}
              label="Name"
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <Form.Item name="slug" label="Slug">
              <Input placeholder="Custom friendly slug" />
            </Form.Item>

            <Form.Item name="ordering" label="Ordering">
              <InputNumber />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ float: 'right' }}
              loading={submiting}
            >
              Submit
            </Button>
          </Form>
        )}
      </Page>
    </>
  );
}

CategoryUpdate.getInitialProps = async (ctx) => ctx.query;

export default CategoryUpdate;
