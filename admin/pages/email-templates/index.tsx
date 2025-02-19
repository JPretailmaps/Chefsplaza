import Page from '@components/common/layout/page';
import { formatDate } from '@lib/date';
import { emailTemplateService } from '@services/email-template.service';
import {
  Breadcrumb, Button, Dropdown, Menu, Table, message
} from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  HomeOutlined,
  DownOutlined,
  EditOutlined
} from '@ant-design/icons';

function EmailTemplates() {
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([]);

  const search = async () => {
    try {
      setSearching(true);
      const resp = await emailTemplateService.findAll();
      setSearching(false);
      setList(resp.data);
    } catch (e) {
      message.error('An error occurred, please try again!');
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render(data, record) {
        return (
          <>
            <Link
              href={{
                pathname: '/email-templates/update',
                query: {
                  id: record._id
                }
              }}
            >
              {record.name}
            </Link>
            <br />
            <small>{record.description}</small>
          </>
        );
      }
    },
    {
      title: 'Subject',
      dataIndex: 'subject'
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id: string) => (
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="edit">
                <Link
                  href={{
                    pathname: '/email-templates/update',
                    query: { id }
                  }}
                  as={`/email-templates/update?id=${id}`}
                >
                  <EditOutlined />
                  {' '}
                  Update
                </Link>
              </Menu.Item>
            </Menu>
            )}
        >
          <Button>
            Actions
            {' '}
            <DownOutlined />
          </Button>
        </Dropdown>
      )
    }
  ];
  return (
    <>
      <Head>
        <title>Email templates</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Email templates</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Page>
        <Table
          dataSource={list}
          columns={columns}
          rowKey="_id"
          loading={searching}
        />
      </Page>
    </>
  );
}

export default EmailTemplates;
