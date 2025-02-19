import {
  ArrowLeftOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import style from './page-heading.module.scss';

interface IProps {
  title: string;
  icon?: any;
  action?: Function
}

function PageHeading({ title, icon, action }: IProps) {
  return (
    <h1 className={style['page-heading']}>
      <span aria-hidden onClick={() => action()}>
        {icon || <ArrowLeftOutlined />}
        {' '}
        {title}
      </span>
    </h1>
  );
}

PageHeading.defaultProps = {
  icon: null,
  action: () => Router.back()
};

export default PageHeading;
