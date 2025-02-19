import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import style from './breadcrumb.module.scss';

interface IBreadcrum {
  title: string;
  href?: string;
}

interface IProps {
  breadcrumbs: IBreadcrum[];
}

export function BreadcrumbComponent({ breadcrumbs }: IProps) {
  return (
    <div className={style.breadcrumb}>
      <Breadcrumb>
        <Breadcrumb.Item href="/" key="home_ico">
          <HomeOutlined />
        </Breadcrumb.Item>
        {breadcrumbs
          && breadcrumbs.length > 0
          && breadcrumbs.map((b) => (
            <Breadcrumb.Item key={b.title + Math.floor(Math.random() * 1000)}>
              {b.href ? (
                <Link href={b.href}>
                  {b.title}
                </Link>
              ) : (
                b.title
              )}
            </Breadcrumb.Item>
          ))}
      </Breadcrumb>
    </div>
  );
}
