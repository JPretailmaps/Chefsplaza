import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ScrollListGallery = dynamic(() => (import('@components/gallery/scroll-list-gallery')));
const FilterContentsBar = dynamic(() => (import('./search-bar')));

type Props = {
  performer: IPerformer
};

function GalleryTab({
  performer
}: Props) {
  const initialFilter = {
    q: '',
    fromDate: '',
    toDate: '',
    performerId: performer._id
  };
  const [filter, setFilter] = useState(initialFilter);
  const [total, setTotal] = useState(performer?.stats?.totalProducts || 0);

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
          {total > 1 ? 'GALLERIES' : 'GALLERY'}
        </h4>
        <FilterContentsBar tab="photo" onFilter={handleFilterSearch} />
      </div>
      <ScrollListGallery
        query={filter}
        getTotal={(t) => setTotal(t)}
      />
    </>
  );
}

export default GalleryTab;
