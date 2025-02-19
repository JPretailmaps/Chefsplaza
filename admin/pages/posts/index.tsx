import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Breadcrumb
} from 'antd';
import {
  HomeOutlined
} from '@ant-design/icons';
import Page from '@components/common/layout/page';
import { postService } from '@services/post.service';
import { SearchFilter } from '@components/common/search-filter';
import { TableListPost } from '@components/post/table-list';
import { isMobile } from 'react-device-detect';
import { showError } from '@lib/message';

function Posts() {
  const [pagination, setPagination] = useState({} as any);
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([] as any);
  const limit = 10;
  const [filter, setFilter] = useState({} as any);
  const [sortBy, setSortBy] = useState('ordering');
  const [sort, setSort] = useState('asc');

  const search = async (page = 1) => {
    try {
      setSearching(true);
      const resp = await postService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sortBy,
        sort
      });
      setSearching(false);
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit
      });
    } catch (e) {
      showError(e);
      setSearching(false);
    }
  };

  const handleTableChange = (pagi, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pagi.current;
    setPagination(pager);
    setSortBy(sorter.field || 'ordering');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
    search(pagination.current);
  };

  const handleFilter = (values) => {
    setFilter({
      ...filter,
      ...values
    });
    search();
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      await postService.delete(id);
      await search(pagination.current);
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Posts</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Page>
        <SearchFilter onSubmit={handleFilter} />
        <div style={{ marginBottom: '20px' }} />
        <div className="table-responsive">
          <TableListPost
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{
              ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
            }}
            onChange={handleTableChange}
            deletePost={deletePost}
          />
        </div>
      </Page>
    </>
  );
}

export default Posts;
