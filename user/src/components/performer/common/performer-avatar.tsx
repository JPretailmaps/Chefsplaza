import Link from 'next/link';
import { TickIcon } from 'src/icons';
import { ImageWithFallback } from '@components/common';
import style from './performer-avatar.module.scss';

function PerformerAvatar({
  performer
}: any) {
  return (
    <Link
      href={{
        pathname: '/[profileId]',
        query: { profileId: performer?.username || performer?._id }
      }}
    >
      <div className={style['creator-grp']}>
        <ImageWithFallback
          options={{
            width: 100,
            height: 100,
            style: { width: 65, height: 65, borderRadius: '50%' },
            className: style.avatar
          }}
          alt="Avatar"
          fallbackSrc="/no-avatar.jpg"
          src={performer?.avatar || '/no-avatar.jpg'}
        />
        <div className={style['name-grp']}>
          <div className={style.name}>
            {performer?.name || 'N/A'}
            {performer?.verifiedAccount && <TickIcon />}
          </div>
          <div className={style.username}>
            {`@${performer?.username || 'n/a'}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PerformerAvatar;
