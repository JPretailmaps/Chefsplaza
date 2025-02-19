import { Alert, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IVideo } from 'src/interfaces';
import { useEffect, useRef, useState } from 'react';
import { showError } from '@lib/utils';
import { videoService } from '@services/video.service';
import { reactionService } from '@services/reaction.service';
import PerformerListVideo from './performer-list';
import { LoadingGridItems } from './loading-grid-items';

interface IProps {
  query?: any;
  getTotal?: Function;
  isBookmark?: boolean;
}

function ScrollListVideo({ query, getTotal, isBookmark }: IProps) {
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState<IVideo[]>([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = isBookmark ? await reactionService.getBookmarks('videos', {
        limit: 12,
        offset: offset.current * 12
      }) : await videoService.userSearch({
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
      <PerformerListVideo videos={isBookmark ? items.map((i: any) => ({ ...i?.objectInfo })) : items} />
      {fetching && <LoadingGridItems active={fetching} limit={12} />}
      {!items.length && !fetching && <div className="text-center">No video was found</div>}
    </InfiniteScroll>
  );
}

ScrollListVideo.defaultProps = {
  query: {},
  getTotal: () => {},
  isBookmark: false
};

export default ScrollListVideo;
