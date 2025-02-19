import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { streamService } from '@services/stream.service';
import style from './style.module.scss';

const StreamItem = dynamic(() => import('./stream-item'));

export default function StreamActiveItems() {
  const [items, setItems] = useState([]);
  const timeout = useRef() as any;

  const getLive = async () => {
    const resp = await streamService.search({ limit: 99 });
    setItems(resp?.data?.data || []);
    timeout.current = setTimeout(() => getLive(), 10000);
  };

  useEffect(() => {
    getLive();
    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  if (!items.length) return null;

  return (
    <div className={style['stream-active-grp']}>
      <h3 className={style.title}>
        <span className={style.txt}>Live Videos</span>
        <Link href="/creator"><small>View all</small></Link>
      </h3>
      <div className={style['stream-list']}>
        {items.length > 0 && items.map((s) => (
          <StreamItem stream={s} key={s._id} />
        ))}
      </div>
    </div>
  );
}
