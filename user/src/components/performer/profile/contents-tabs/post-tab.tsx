import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ScrollListFeed = dynamic(() => (import('@components/post/list/scroll-list')));
const FilterContentsBar = dynamic(() => (import('./search-bar')));

type Props = {
  performer: IPerformer
};

function PostTab({
  performer
}: Props) {
  const [total, setTotal] = useState(0);
  const [isGrid, setGrid] = useState(false);
  const [filters, setFilters] = useState({ performerId: performer._id });

  const handleFilter = (values) => {
    setFilters({ ...values, performerId: performer._id });
  };

  return (
    <>
      <div className="heading-tab">
        <h4>
          {total > 0 && total}
          {' '}
          {total > 1 ? 'POSTS' : 'POST'}
        </h4>
        <FilterContentsBar tab="post" onFilter={handleFilter} handleViewGrid={(val) => setGrid(val)} />
      </div>
      <ScrollListFeed
        query={filters}
        getTotal={(t) => setTotal(t)}
        isGrid={isGrid}
      />
    </>
  );
}

export default PostTab;
