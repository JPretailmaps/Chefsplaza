import PerformerCard from '@components/performer/card/grid-card';
import { showError } from '@lib/utils';
import { performerService } from '@services/performer.service';
import { reactionService } from '@services/reaction.service';
import {
  Alert, Col, Row, Spin
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IPerformer } from 'src/interfaces';

interface IProps {
  query?: any;
  getTotal?: Function;
  isBookmark?: boolean;
}

function ScrollListPerformers({
  query, getTotal, isBookmark
}: IProps) {
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState<IPerformer[]>([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = isBookmark ? await reactionService.getBookmarks('performers', {
        limit: 12,
        offset: offset.current * 12
      }) : await performerService.search({
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
  }, [query]);

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
      {items.length > 0 && (
        <Row>
          {items.map((p: any) => (
            <Col xs={24} sm={12} md={6} key={p._id}>
              <PerformerCard performer={isBookmark ? p?.objectInfo : p} />
            </Col>
          ))}
        </Row>
      )}
      {!items.length && !fetching && <div className="text-center">No profile was found</div>}
      {fetching && (
        <div className="text-center">
          <Spin />
        </div>
      )}
    </InfiniteScroll>
  );
}

ScrollListPerformers.defaultProps = {
  query: {},
  getTotal: () => {},
  isBookmark: false
};

export default ScrollListPerformers;
