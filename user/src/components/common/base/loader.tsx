import classNames from 'classnames';
import dynamic from 'next/dynamic';
import style from './loader.module.scss';

const Logo = dynamic(() => import('./logo'), {
  ssr: false,
  loading: () => (
    <div className={classNames(
      style['loading-screen'],
      {
        [style.active]: true
      }
    )}
    >
      <div style={{ textAlign: 'center' }}>
        <div className={style.loader} />
      </div>
    </div>
  )
});

interface IProps {
  active: boolean;
  customText: string;
}

function Loader({ customText = '', active }: IProps) {
  return (
    <div className={classNames(
      style['loading-screen'],
      {
        [style.active]: active
      }
    )}
    >
      <div style={{ textAlign: 'center' }}>
        <Logo />
        {customText && <p className="highlight-color">{customText}</p>}
      </div>
    </div>
  );
}

export default Loader;
