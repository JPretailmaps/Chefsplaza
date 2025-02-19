import { FloatButton } from 'antd';
import dynamic from 'next/dynamic';
import style from './primary-layout.module.scss';

const Footer = dynamic(() => import('@components/common/footer'));

interface IProps {
  children: any;
}

export default function BlankLayout({ children }: IProps) {
  return (
    <div id="primaryLayout" className="main-layout">
      <div className="main-content">
        {children}
        <Footer />
        <FloatButton.BackTop className={style.backTop} />
      </div>
    </div>
  );
}
