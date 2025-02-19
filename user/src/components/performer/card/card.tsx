/* eslint-disable react/require-default-props */
import { message } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { TickIcon } from 'src/icons';
import { IPerformer, IUser } from 'src/interfaces';

import { COUNTRIES } from 'src/constants/countries';
import Image from 'next/image';
import { ImageWithFallback } from '@components/common';
import classNames from 'classnames';
import { StarFilled } from '@ant-design/icons';
import style from './card.module.scss';
import FollowButton from '../buttons/follow-button';

interface IProps {
  performer: IPerformer;
  onFollow?: Function;
}

export function PerformerCard({ performer, onFollow }: IProps) {
  const user = useSelector((state: any) => state.user.current) as IUser;

  const handleJoinStream = () => {
    if (!user._id) {
      message.error('Please log in or register!');
      return;
    }
    if (user.isPerformer) return;
    if (!performer?.isSubscribed) {
      message.error('Please subscribe to this creator!');
      return;
    }
    Router.push({
      pathname: '/streaming/[username]',
      query: {
        performer: JSON.stringify(performer),
        username: performer?.username || performer?._id
      }
    }, `/streaming/${performer?.username || performer?._id}`);
  };

  const country = performer.country && COUNTRIES.find((c) => c.code === performer.country);

  return (
    <div className={style['model-card']}>
      <Link
        href={{
          pathname: '/[profileId]',
          query: { profileId: performer?.username || performer?._id }
        }}
        as={`/${performer?.username || performer?._id}`}
      >
        <ImageWithFallback
          options={{
            width: 500,
            height: 200,
            quality: 50,
            className: style['cover-img'],
            sizes: '(max-width: 767px) 50vw, (min-width: 768px) 20vw'
          }}
          src={performer?.cover || '/default-banner.jpeg'}
          fallbackSrc="/default-banner.jpeg"
          alt="cover"
        />
      </Link>
      {performer?.isFreeSubscription && (
        <span className={style['free-tag']}>Free</span>
      )}
      {performer?.live > 0 && <span className={style['live-tag']} aria-hidden onClick={() => handleJoinStream()}>Live</span>}
      <FollowButton performer={performer} onFollow={onFollow} classes="follow-btn" />
      <Link
        href={{
          pathname: '/[profileId]',
          query: { profileId: performer?.username || performer?._id }
        }}
        as={`/${performer?.username || performer?._id}`}
      >
        <div className={style['card-avatar']}>
          <div className={style['avatar-img']}>
            <ImageWithFallback
              options={{
                width: 100,
                height: 100,
                quality: 30,
                sizes: '(max-width: 767px) 30vw, (min-width: 768px) 10vw'
              }}
              src={performer?.avatar || '/no-avatar.jpg'}
              fallbackSrc="/no-avatar.jpg"
              alt="avatar"
            />
            <span className={classNames(style['online-status'], {
              [style.active]: performer?.isOnline > 0
            })}
            />
          </div>
        </div>
        <div className={style['card-bottom']}>
          <div className={style['name-grp']}>
            <div className={style.name}>
              {performer?.name || 'N/A'}
              &nbsp;
              {country && (
                <Image
                  unoptimized
                  width={40}
                  height={40}
                  quality={30}
                  sizes="(max-width: 768px) 10vw, (max-width: 2100px) 5vw"
                  alt="performer-country"
                  className={style['model-country']}
                  src={country.flag}
                />
              )}
              &nbsp;
              {performer?.verifiedAccount && <TickIcon />}
              &nbsp;
              {performer?.isFeatured && <StarFilled />}
            </div>
            <div className={style.username}>
              {`@${performer?.username || 'n/a'}`}
            </div>
          </div>
          <span className={style.age}>
            {performer.dateOfBirth && moment().diff(moment(performer.dateOfBirth), 'years') > 0 && `${moment().diff(moment(performer.dateOfBirth), 'years')}+`}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default PerformerCard;
