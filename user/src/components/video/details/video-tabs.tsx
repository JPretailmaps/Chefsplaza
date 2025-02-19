import CommentWrapper from '@components/comment/comment-wrapper';
import PerformerAvatar from '@components/performer/common/performer-avatar';
import { IPerformer } from '@interfaces/performer';
import { IVideo } from '@interfaces/video';
import { Tabs } from 'antd';

interface IProps {
  video: IVideo;
  activeKey: string;
  onTabChange: Function;
}

export function VideoTabs({ video, activeKey, onTabChange }: IProps) {
  return (
    <Tabs
      defaultActiveKey="description"
      className="custom"
      activeKey={activeKey || 'description'}
      onChange={(t) => onTabChange(t)}
    >
      <Tabs.TabPane tab="Description" key="description">
        <p>{video.description || 'No description...'}</p>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Participants" key="participants">
        {video.participants?.length > 0 ? (
          video.participants.map((per: IPerformer) => <PerformerAvatar performer={per} />)
        ) : (
          <p>No profile was found.</p>
        )}
      </Tabs.TabPane>
      <Tabs.TabPane
        tab="Comments"
        key="comment"
      >
        <CommentWrapper objectId={video._id} objectType="video" />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default VideoTabs;
