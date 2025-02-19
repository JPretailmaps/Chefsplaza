import { StarFilled, StarOutlined } from '@ant-design/icons';
import { dobToAge, shortenLargeNumber } from '@lib/index';
import Link from 'next/link';
import { connect } from 'react-redux';
import { TickIcon } from 'src/icons';
import { IPerformer, IUser } from 'src/interfaces';
import { COUNTRIES } from 'src/constants/countries';
import { ImageWithFallback } from '@components/common';
import classNames from 'classnames';
import style from './grid-card.module.scss';
import FollowButton from '../buttons/follow-button';

interface IProps {
  performer: IPerformer;
  user: IUser;
}

function PerformerGridCard({ performer, user }: IProps) {
  const country = COUNTRIES.find((c) => c.code === performer.country);
  return (
    <div className={classNames(
      style['grid-card']
    )}
    >
      <div className={classNames(style['grid-card-img'], {
        [style.live]: performer?.live > 0
      })}
      >
        <Link
          href={{
            pathname: '/[profileId]',
            query: { profileId: performer?.username || performer?._id }
          }}
          as={`/${performer?.username || performer?._id}`}
        >
          <ImageWithFallback
            options={{
              width: 260,
              height: 360,
              quality: 50,
              sizes: '20vw',
              className: style.avatar
            }}
            alt="avatar"
            src={performer?.avatar || '/no-avatar.jpg'}
            fallbackSrc="/no-avatar.jpg"
          />
        </Link>
        <span className={classNames(style['online-status'], {
          [style.active]: performer?.isOnline > 0
        })}
        />
        {performer?.live > 0 && (
          <span className={style['live-status']}>
            <i />
            {' '}
            <span>Live</span>
          </span>
        )}
      </div>
      <div className={style['grid-card-txt']}>
        <div className={classNames(style['model-name'])}>

          <h3>{performer?.name || performer?.username || 'N/A'}</h3>
          {country && (
            <ImageWithFallback
              alt="performer-country"
              src={country.flag}
              options={{
                className: style['model-country']
              }}
            />
          )}
          {performer?.verifiedAccount && <TickIcon />}
          &nbsp;
          {performer?.isFeatured && <StarFilled />}
        </div>
        <div className={style['card-stat']}>
          <span>
            {shortenLargeNumber(performer?.score || 0)}
            {' '}
            <StarOutlined />
          </span>
          {performer?.dateOfBirth && (
            <span>
              {dobToAge(performer?.dateOfBirth)}
            </span>
          )}
        </div>
      </div>
      <div>
        {/* {performer?.isFeatured && <div className={style['featured-tag']}>Featured</div>} */}
        {!user?.isPerformer && (
          <FollowButton performer={performer} classes={style['follow-btn']} />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: { ...state.user.current }
});

export default connect(mapStateToProps)(PerformerGridCard);
