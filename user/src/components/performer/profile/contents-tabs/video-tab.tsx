import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ScrollListVideo = dynamic(() => (import('@components/video/scroll-list-item')), { ssr: false });
const FilterContentsBar = dynamic(() => (import('./search-bar')), { ssr: false });

type Props = {
  performer: IPerformer
};

function VideoTab({
  performer
}: Props) {
  const initialFilter = {
    q: '',
    fromDate: '',
    toDate: '',
    performerId: performer._id
  };
  const [filter, setFilter] = useState(initialFilter);
  const [total, setTotal] = useState(performer?.stats?.totalVideos || 0);

  const handleFilterSearch = (values) => {
    const newFilters = { ...filter, ...values };
    setFilter(newFilters);
  };

  return (
    <>
      <div className="heading-tab">
        <h4>
          {total > 0 && total}
          {' '}
          {total > 1 ? 'VIDEOS' : 'VIDEO'}
        </h4>
        <FilterContentsBar tab="video" onFilter={handleFilterSearch} />
      </div>
      <ScrollListVideo
        query={filter}
        getTotal={(t) => setTotal(t)}
      />
    </>
  );
}

export default VideoTab;
