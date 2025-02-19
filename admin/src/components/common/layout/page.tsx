import style from './page.module.scss';

interface IProps {
  children: any;
}

export default function Page({
  children
}: IProps) {
  return (
    <div
      className={style.content_inner}
    >
      {children}
    </div>
  );
}
