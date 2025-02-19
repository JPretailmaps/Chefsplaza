import {
  ArrowLeftOutlined, FireOutlined, PictureOutlined, ShoppingOutlined, VideoCameraOutlined,
  StarOutlined
} from '@ant-design/icons';
import StatsRow from '@components/performer/profile/stats-row';
import { IPerformer } from '@interfaces/performer';
import {
  Button, Image, Tabs
} from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { TickIcon } from 'src/icons';
import { skeletonLoading } from '@lib/loading';
import { LoadingGridItems } from '@components/video/loading-grid-items';
import style from './profile-container.module.scss';
import LiveButton from '../buttons/live-button';

const GalleryTab = dynamic(() => import('./contents-tabs/gallery-tab'), { ssr: false, loading: () => <LoadingGridItems active limit={12} /> });
const PostTab = dynamic(() => import('./contents-tabs/post-tab'));
const ProductTab = dynamic(() => import('./contents-tabs/product-tab'), { ssr: false, loading: () => <LoadingGridItems active limit={12} /> });
const VideoTab = dynamic(() => import('./contents-tabs/video-tab'), { ssr: false, loading: () => <LoadingGridItems active limit={12} /> });
const SubscribeButtons = dynamic(() => import('../buttons/subscribe-buttons'));
const UserActionsGroup = dynamic(() => import('./user-actions-group'));
const AboutPerformer = dynamic(() => import('./about-profile'), { ssr: false, loading: skeletonLoading });
const ModalWelcomeVideo = dynamic(() => import('./modal-welcome-video'), { ssr: false });

type IProps = {
  performer: IPerformer;
  previousRoute: string;
};

function ProfileContainer({
  performer, previousRoute
}: IProps) {
  if (!performer) return null;
  const router = useRouter();

  const items = [
    {
      key: 'post',
      label: <FireOutlined />,
      children: <PostTab performer={performer} />
    },
    {
      key: 'video',
      label: <VideoCameraOutlined />,
      children: <VideoTab performer={performer} />
    },
    {
      key: 'photo',
      label: <PictureOutlined />,
      children: <GalleryTab performer={performer} />
    },
    {
      key: 'store',
      label: <ShoppingOutlined />,
      children: <ProductTab performer={performer} />
    }
  ];

  return (
    <div className={style['performer-profile']}>
      <div className="main-container">
        <div className={style['top-profile']}>
          <Image
            loading="lazy"
            fallback="/default-banner.jpeg"
            src={performer.cover || '/default-banner.jpeg'}
            alt="creator-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 2100px) 50vw"
          />
          <div className={style['bg-2nd']} />
          <div className={style['top-right-profile']}>
            {previousRoute && (
              <Button className={style['arrow-back']} onClick={() => router.back()}>
                <ArrowLeftOutlined />
                BACK
              </Button>
            )}
            <StatsRow performer={performer} />
          </div>
        </div>
        <div className={style['main-profile']}>
          <div className={style['img-name-grp']}>
            <div className={style['left-col']}>
              <div className={style['left-col-photo']}>
                <Image
                  fallback="/no-avatar.jpg"
                  loading="lazy"
                  src={performer.avatar || '/no-avatar.jpg'}
                  alt="creator-avatar"
                  sizes="(max-width: 768px) 20vw, (max-width: 2100px) 15vw"
                />
                <LiveButton performer={performer} />
              </div>
              <div className={style['m-user-name']}>
                <div className={style.name}>
                  {performer.name || 'N/A'}
                  &nbsp;
                  {performer.verifiedAccount && (
                    <TickIcon />
                  )}
                  &nbsp;
                  {performer.isFeatured && <StarOutlined />}
                </div>
                <div className={style.username}>
                  {`@${performer.username || 'n/a'}`}
                </div>
              </div>
            </div>
            <UserActionsGroup performer={performer} />
          </div>
          <AboutPerformer performer={performer} />
          <SubscribeButtons performer={performer} />
        </div>
        <div className={style['model-content']}>
          <Tabs
            defaultActiveKey="post"
            items={items}
            size="large"
          />
        </div>
      </div>
      {!!performer && <ModalWelcomeVideo performer={performer} />}
    </div>
  );
}

export default ProfileContainer;
