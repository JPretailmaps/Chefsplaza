import { IGallery } from '@interfaces/gallery';
import {
  Alert,
  Col, Row, Spin
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useEffect, useRef, useState } from 'react';
import { galleryService } from '@services/gallery.service';
import { showError } from '@lib/utils';
import { reactionService } from '@services/reaction.service';
import { LoadingGridItems } from '@components/video/loading-grid-items';
import GalleryCard from './gallery-card';

interface IProps {
  query?: any;
  getTotal?: Function;
  isBookmark?: boolean;
}

function ScrollListGallery({ query, getTotal, isBookmark }: IProps) {
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState<IGallery[]>([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = isBookmark ? await reactionService.getBookmarks('galleries', {
        limit: 12,
        offset: offset.current * 12
      }) : await galleryService.userSearch({
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
      <Row>
        {items.length > 0
            && items.map((item: any) => (
              <Col
                xs={12}
                sm={12}
                md={8}
                lg={6}
                key={item._id}
              >
                <GalleryCard gallery={isBookmark ? item?.objectInfo : item} />
              </Col>
            ))}
      </Row>
      {fetching && <LoadingGridItems active={fetching} limit={12} />}
      {!fetching && !items.length && (
        <div className="text-center">
          No gallery was found
        </div>
      )}
    </InfiniteScroll>
  );
}

ScrollListGallery.defaultProps = {
  query: {},
  getTotal: () => {},
  isBookmark: false
};

export default ScrollListGallery;
