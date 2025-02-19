import { Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IProduct } from 'src/interfaces';

import { useEffect, useRef, useState } from 'react';
import { showError } from '@lib/utils';
import { productService } from '@services/product.service';
import { reactionService } from '@services/reaction.service';
import { PerformerListProduct } from './performer-list-product';

interface IProps {
  query?: any;
  getTotal?: Function;
  isBookmark?: boolean;
}

function ScrollListProduct({
  query, getTotal, isBookmark
}: IProps) {
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = isBookmark ? await reactionService.getBookmarks('products', {
        limit: 12,
        offset: offset.current * 12
      }) : await productService.userSearch({
        limit: 12,
        offset: offset.current * 12,
        ...query
      });
      !more ? setItems(resp.data.data) : setItems([...items, ...resp.data.data]);
      setTotal(resp.data.total);
      getTotal && getTotal(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const getMore = () => {
    offset.current += 1;
    getItems(true);
  };

  useEffect(() => {
    offset.current = 0;
    getItems();
  }, [JSON.stringify(query)]);

  return (
    <InfiniteScroll
      dataLength={items.length}
      hasMore={total > items.length}
      loader={null}
      next={() => {
        !fetching && getMore();
      }}
      endMessage={null}
      scrollThreshold={0.9}
    >
      <PerformerListProduct products={isBookmark ? items.map((i) => i?.objectInfo) : items} />
      {!fetching && !items.length && (
        <div className="text-center">
          No product was found
        </div>
      )}
      {fetching && <div className="text-center"><Spin /></div>}
    </InfiniteScroll>
  );
}

ScrollListProduct.defaultProps = {
  query: {},
  getTotal: () => {},
  isBookmark: false
};

export default ScrollListProduct;
