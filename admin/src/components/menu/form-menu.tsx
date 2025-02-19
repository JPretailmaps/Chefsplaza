/* eslint-disable prefer-promise-reject-errors */
import {
  createRef, useEffect, useRef, useState
} from 'react';
import {
  Form, Input, Button, Select, Switch, Popover
} from 'antd';
import { IMenu } from 'src/interfaces';
import { FormInstance } from 'antd/lib/form';
import { SelectPostDropdown } from '@components/post/select-post-dropdown';
import { isUrl } from '@lib/string';
import Link from 'next/link';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface IProps {
  menu?: IMenu;
  onFinish: Function;
  submiting?: boolean;
}

export function FormMenu({ menu = undefined, onFinish, submiting = false }: IProps) {
  const formRef = useRef<any>(null);

  const [isInternal, setIsInternal] = useState(false);
  const [path, setPath] = useState('');

  const setFormVal = (field: string, val: any) => {
    const instance = formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  };

  useEffect(() => {
    if (!formRef.current) formRef.current = createRef();
    if (menu) {
      setIsInternal(menu.internal);
      setPath(menu.path);
    }
  }, []);

  if (!formRef.current) formRef.current = createRef();

  return (
    <Form
      ref={formRef}
      onFinish={onFinish.bind(this)}
      initialValues={
        menu
        || ({
          title: '',
          path: '',
          help: '',
          public: false,
          internal: false,
          parentId: null,
          section: 'footer',
          ordering: 0,
          isPage: false,
          isNewTab: false
        })
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item
        name="internal"
        label={(
          <>
            <Popover content={<p>Create menu link to an internal page or to an external source.</p>}>
              <a style={{ marginRight: '5px' }}>
                <QuestionCircleOutlined />
              </a>
            </Popover>
            Link to an internal page?
          </>
        )}
        valuePropName="checked"
      >
        <Switch
          defaultChecked={false}
          onChange={(val) => {
            setIsInternal(val);
            if (!val) {
              setFormVal('path', '');
              setFormVal('isPage', false);
            }
          }}
        />
      </Form.Item>
      <Form.Item name="isNewTab" label="Open in new tab?" valuePropName="checked">
        <Switch defaultChecked={false} />
      </Form.Item>
      <Form.Item name="title" rules={[{ required: true, message: 'Please input title of menu item!' }]} label="Title">
        <Input placeholder="Enter menu item title" />
      </Form.Item>
      {isInternal ? (
        <Form.Item
          name="path"
          label={(
            <>
              <Popover
                content={(
                  <p>
                    If there is no data, please create a post
                    {' '}
                    <Link href="/posts/create">
                      here
                    </Link>
                  </p>
                )}
                title={null}
              >
                <a style={{ marginRight: '5px' }}>
                  <QuestionCircleOutlined />
                </a>
              </Popover>
              Posts
            </>
          )}
        >
          <SelectPostDropdown
            defaultValue={path && path.replace('/page/', '')}
            onSelect={(val) => {
              setFormVal('path', val ? `/page/${val}` : '');
            }}
          />
        </Form.Item>
      ) : (
        <Form.Item
          name="path"
          rules={[
            { required: true, message: 'Please input URL of menu item!' },
            {
              validator: (rule, value) => {
                if (!value) return Promise.resolve();
                const isUrlValid = isUrl(value);
                if (isInternal && isUrlValid) {
                  return Promise.reject('The path is not valid');
                }
                if (!isInternal && !isUrlValid) {
                  return Promise.reject('The url is not valid');
                }
                return Promise.resolve();
              }
            }
          ]}
          label="Url"
        >
          <Input placeholder="Enter menu item URL" />
        </Form.Item>
      )}
      <Form.Item name="section" label="Section" rules={[{ required: true, message: 'Please select menu section!' }]}>
        <Select disabled>
          <Select.Option key="footer" value="footer">
            Footer
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 20, offset: 0 }}>
        <Button type="primary" htmlType="submit" loading={submiting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
