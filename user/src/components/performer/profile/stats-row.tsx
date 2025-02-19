import {
  FireOutlined,
  HeartOutlined, PictureOutlined, ShoppingOutlined, UsergroupAddOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { IPerformer } from '@interfaces/performer';
import { shortenLargeNumber } from '@lib/number';

import style from './stats-row.module.scss';

type Props = {
  performer: IPerformer;
};

function StatsRow({
  performer
}: Props) {
  return (
    <div className={style['stats-row']}>
      <div className={style['tab-stat']}>
        <div className={style['tab-item']}>
          <span>
            {shortenLargeNumber(performer.stats?.totalFeeds || 0)}
            {' '}
            <FireOutlined />
          </span>
        </div>
        <div className={style['tab-item']}>
          <span>
            {shortenLargeNumber(performer.stats?.totalVideos || 0)}
            {' '}
            <VideoCameraOutlined />
          </span>
        </div>
        <div className={style['tab-item']}>
          <span>
            {shortenLargeNumber(performer.stats?.totalPhotos || 0)}
            {' '}
            <PictureOutlined />
          </span>
        </div>
        <div className={style['tab-item']}>
          <span>
            {shortenLargeNumber(performer.stats?.totalProducts || 0)}
            {' '}
            <ShoppingOutlined />
          </span>
        </div>
        <div className={style['tab-item']}>
          <span>
            {shortenLargeNumber(performer.stats?.likes || 0)}
            {' '}
            <HeartOutlined />
          </span>
        </div>
        <div className={style['tab-item']}>
          <span>
            {shortenLargeNumber(performer.stats?.subscribers || 0)}
            {' '}
            <UsergroupAddOutlined />
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatsRow;
