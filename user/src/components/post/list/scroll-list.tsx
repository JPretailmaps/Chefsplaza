import { IFeed } from '@interfaces/index';
import { showError } from '@lib/utils';
import { feedService } from '@services/feed.service';
import { Alert, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { reactionService } from '@services/reaction.service';
import dynamic from 'next/dynamic';
import style from './scroll-list.module.scss';

const FeedCard = dynamic(() => import('../card/feed-card'));
const FeedGridCard = dynamic(() => import('../card/grid-card'));

interface IProps {
  query: any; // todo - defind interface
  isGrid?: boolean;
  getTotal?: Function;
  isBookmark?: boolean;
}

function ScrollListFeed({
  query,
  isGrid,
  getTotal,
  isBookmark
}: IProps) {
  const [fetching, setFetching] = useState(true);
  const [items, setItems] = useState<IFeed[]>([]);
  const [total, setTotal] = useState(0);
  const offset = useRef<number>(0);

  const getItems = async (more = false) => {
    try {
      setFetching(true);
      const resp = isBookmark ? await reactionService.getBookmarks('feeds', {
        limit: 12,
        offset: offset.current * 12
      }) : await feedService.userSearch({
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
    if (Math.round(total / 12) === offset.current) return;
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
      scrollThreshold={0.7}
    // scrollableTarget="primaryLayout"
    >
      <div className={isGrid ? style['grid-view'] : style['fixed-scroll']}>
        {items?.map((item: any) => {
          if (isGrid) {
            return <FeedGridCard feed={item} key={item._id} />;
          }
          return (
            <FeedCard
              feed={isBookmark ? { ...item?.objectInfo, isBookMarked: true } : item}
              key={item._id}
            />
          );
        })}
      </div>
      {!items.length && !fetching && (
        <div className={style['fixed-scroll']}>
          <Alert
            className="text-center"
            message="No post was found"
            type="info"
          />
        </div>
      )}
      {fetching && (
        <div className="text-center">
          <Spin />
        </div>
      )}
    </InfiniteScroll>
  );
}

ScrollListFeed.defaultProps = {
  isGrid: false,
  getTotal: () => { },
  isBookmark: false
};

export default ScrollListFeed;
