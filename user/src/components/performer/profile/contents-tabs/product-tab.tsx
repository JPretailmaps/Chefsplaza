import { IPerformer } from '@interfaces/performer';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ScrollListProduct = dynamic(() => (import('@components/product/scroll-list-item')), { ssr: false });
const FilterContentsBar = dynamic(() => (import('./search-bar')), { ssr: false });

type Props = {
  performer: IPerformer
};

function ProductTab({
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
          {total > 1 ? 'PRODUCTS' : 'PRODUCTS'}
        </h4>
        <FilterContentsBar tab="store" onFilter={handleFilterSearch} />
      </div>
      <ScrollListProduct
        query={filter}
        getTotal={(t) => setTotal(t)}
      />
    </>
  );
}

export default ProductTab;
