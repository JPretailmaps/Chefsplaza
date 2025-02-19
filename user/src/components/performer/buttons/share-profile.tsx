import { IPerformer } from '@interfaces/index';
import { useSelector } from 'react-redux';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton
} from 'react-share';
import { ShareIcon } from 'src/icons';
import { Popover, Button } from 'antd';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import getConfig from 'next/config';
import { stripTags } from '@lib/string';
import style from './share-profile.module.scss';

const { publicRuntimeConfig } = getConfig();

type IProps = {
  performer: IPerformer;
}

function SocialSharePerformer({ performer }: IProps) {
  const { siteName } = useSelector((state: any) => state.ui);
  const title = stripTags(performer?.bio || performer?.name || performer?.username);
  const shareUrl = `https://${publicRuntimeConfig.DOMAIN}/${performer?.username || performer?._id}`;
  const { theme } = useTheme();

  const shareContent = (
    <div className={style['social-share-btns']}>
      <FacebookShareButton
        url={shareUrl}
        quote={title}
        hashtag={`#${performer?.username} #${performer?.name}`}
      >
        <FacebookIcon size={40} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={title}
        hashtags={[siteName, performer?.username, performer?.name]}
      >
        {theme === 'dark' ? <Image priority src="/twitter-icon-white.webp" alt="twitter-icon" width={40} height={40} />
          : <Image priority src="/twitter.svg" alt="twitter-icon" width={40} height={40} />}
      </TwitterShareButton>
    </div>
  );

  return (
    <Popover title="Share to social network" content={shareContent} trigger="click">
      <Button className="normal">
        <ShareIcon />
        <span className="show-mobile">Share</span>
      </Button>
    </Popover>
  );
}

export default SocialSharePerformer;
