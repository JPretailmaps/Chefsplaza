import { IBanner } from '@interfaces/banner';
import { Carousel } from 'antd';
import Image from 'next/image';
import {
  LeftOutlined, RightOutlined
} from '@ant-design/icons';
import style from './banner.module.scss';

interface IProps {
  banners: IBanner[];
}

export function Banners({ banners }: IProps) {
  if (!banners || !banners.length) return null;
  return (
    <Carousel
      effect="fade"
      adaptiveHeight
      autoplay
      swipeToSlide
      arrows
      dots={false}
      prevArrow={<LeftOutlined />}
      nextArrow={<RightOutlined />}
      className={style['banner-carousel']}
    >
      {banners.map((item) => (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <a key={item._id} href={(item.link || null)} target="_.blank">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={item?.photo?.url}
            alt="banner"
            key={item._id}
            style={{ width: '100%', height: 'auto' }}
          />
        </a>
      ))}
    </Carousel>
  );
}

export default Banners;
