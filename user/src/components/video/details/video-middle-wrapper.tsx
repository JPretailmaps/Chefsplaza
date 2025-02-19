import PerformerAvatar from '@components/performer/common/performer-avatar';
import ReactionButtons from '@components/action-buttons/reaction-buttons';
import { IVideo } from '@interfaces/video';
import { useState } from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { skeletonLoading } from '@lib/loading';
import style from './video-details-wrapper.module.scss';

const VideoTabs = dynamic(() => import('./video-tabs'), { ssr: false, loading: skeletonLoading });
const RelatedVideos = dynamic(() => import('./related-videos'), { ssr: false, loading: skeletonLoading });

type Props = {
  video: IVideo
};

function VideoMiddleWrapper({
  video
}: Props) {
  const [activeTab, setActiveTab] = useState('description');

  const onChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className={classNames(
        style['vid-act']
      )}
      >
        <div className={style['vid-split']}>
          <PerformerAvatar performer={video.performer} />
          <ReactionButtons
            objectId={video._id}
            objectType="video"
            totalLike={video.stats.likes}
            isLiked={video.isLiked}
            isBookmarked={video.isBookmarked}
            totalComment={video.stats.comments}
            onCommentClick={() => setActiveTab('comment')}
            activeComment={activeTab === 'comment'}
          />
        </div>
      </div>
      {video.tags && video.tags.length > 0 && (
        <div className={style['vid-tags']}>
          {video.tags.map((tag) => (
            <a color="magenta" key={tag} style={{ marginRight: 5 }}>
              #
              {tag || 'tag'}
            </a>
          ))}
        </div>
      )}
      <VideoTabs
        video={video}
        activeKey={activeTab}
        onTabChange={(tab) => onChangeTab(tab)}
      />
      <div className="related-items">
        <h4 className="ttl-1">You may also like</h4>
        <RelatedVideos videoId={video._id} />
      </div>
    </>
  );
}

export default VideoMiddleWrapper;
