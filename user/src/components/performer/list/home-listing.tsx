import {
  SyncOutlined, TagOutlined, LeftOutlined, RightOutlined
} from '@ant-design/icons';
import {
  Button, Carousel, Tooltip
} from 'antd';
import { chunk } from 'lodash';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import { useClientFetch } from '@lib/request';
import { buildUrl } from '@lib/string';
import { useRouter } from 'next/router';
import { performerService } from '@services/performer.service';
import PerformerCard from '../card/card';
import style from './home-listing.module.scss';

const HomeFooter = dynamic(() => (import('@components/common/footer')), { ssr: false });

export function HomePerformers() {
  const [isFreeSubscription, setIsFree] = useState('') as any;
  const [refresh, setRefresh] = useState(false);
  const user = useSelector((state: any) => state.user.current);
  const carouselRef = useRef() as any;

  const {
    data, isLoading
  } = useClientFetch(buildUrl(performerService.randomSearchUrl(), {
    isFreeSubscription,
    refresh
  }));

  const chunkPerformers = chunk((data?.data || []).filter((s) => s?._id !== user?._id), 4);

  return (
    <div className={style['suggestion-bl']}>
      <div className={style['sug-top']}>
        <span className={style['sug-text']}>SUGGESTIONS</span>
        <div className={style['btns-grp']}>
          <Tooltip title={isFreeSubscription ? 'Show all' : 'Show only free'}>
            <Button
              onClick={() => setIsFree(!isFreeSubscription ? true : '')}
              className={classNames(style.free_btn, {
                [style.active]: isFreeSubscription
              })}
            >
              <TagOutlined />
              <span className={classNames(
                style['free-txt'],
                { [style.active]: isFreeSubscription === true }
              )}
              >
                Free
              </span>
            </Button>
          </Tooltip>
          <Tooltip title="Refresh">
            <Button onClick={() => setRefresh(!refresh)}>
              <SyncOutlined spin={isLoading} />
            </Button>
          </Tooltip>
          <Button onClick={() => carouselRef.current && carouselRef.current.prev()}><LeftOutlined /></Button>
          <Button onClick={() => carouselRef.current && carouselRef.current.next()}><RightOutlined /></Button>
        </div>
      </div>
      <div className="sug-content">
        <Carousel
          autoplay
          autoplaySpeed={5000}
          adaptiveHeight
          ref={carouselRef}
          swipeToSlide
          arrows={false}
          dots={false}
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
        >
          {chunkPerformers.length > 0 && chunkPerformers.map((arr: any, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`newaa_${index}`}>
              {arr.length > 0 && arr.map((p) => <PerformerCard performer={p} key={p._id} />)}
            </div>
          ))}
        </Carousel>
      </div>
      {!isLoading && !data?.data?.length && <p className="text-center">No profile was found</p>}
      <div className={classNames(style['home-footer'], {
        [style.active]: true
      })}
      >
        <HomeFooter />
      </div>
    </div>
  );
}

export default HomePerformers;
