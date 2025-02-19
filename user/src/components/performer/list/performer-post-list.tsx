import { SearchFilter } from '@components/common/search-filter';
import FeedList from '@components/post/list/table-list';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { showError } from '@lib/utils';
import { feedService } from '@services/index';
import {
  message
} from 'antd';
import { useRouter } from 'next/router';

const type = [
  {
    key: '',
    text: 'All types'
  },
  {
    key: 'text',
    text: 'Text'
  },
  {
    key: 'video',
    text: 'Video'
  },
  {
    key: 'photo',
    text: 'Photo'
  },
  {
    key: 'scheduled-streaming',
    text: 'Scheduled Streaming'
  }
];

function PerformerPostListing() {
  const router = useRouter();
  const {
    sort = 'desc', sortBy = 'updatedAt', current = 1, pageSize = 10
  } = router.query;

  const deleteFeed = async (feed) => {
    if (!window.confirm('All earnings related to this post will be refunded. Are you sure to remove it?')) {
      return;
    }
    try {
      await feedService.delete(feed._id);
      message.success('Post deleted successfully');
      router.replace({
        pathname: router.pathname,
        query: router.query
      });
    } catch (e) {
      showError(e);
    }
  };

  const {
    data, error, isLoading, handleFilter, handleTableChange
  } = useClientFetch(buildUrl(feedService.performerSearchUrl(), {
    ...router.query,
    sort,
    sortBy,
    limit: pageSize,
    offset: (Number(current) - 1) * Number(pageSize)
  }));

  if (error) {
    showError(error);
  }

  return (
    <>
      <SearchFilter
        onSubmit={handleFilter}
        type={type}
        searchWithKeyword
        dateRange
      />
      <FeedList
        feeds={data?.data || []}
        total={data?.total || 0}
        pageSize={Number(pageSize)}
        current={(Number(current))}
        searching={isLoading}
        onChange={handleTableChange}
        onDelete={deleteFeed}
      />
    </>
  );
}

export default PerformerPostListing;
