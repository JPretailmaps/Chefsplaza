import { } from '@ant-design/icons';
import { IVideo } from '@interfaces/index';
import { Button } from 'antd';

interface IProps {
  video: IVideo;
  onFinish: Function;
  submiting: boolean;
}

export function PurchaseVideoForm(props: IProps) {
  const { onFinish, submiting = false, video } = props;
  return (
    <div className="text-center">
      <div className="tip-performer">
        <img alt="p-avt" src={video?.performer?.avatar || '/no-avatar.jpg'} style={{ width: '100px', borderRadius: '50%' }} />
        <div>
          {video?.performer?.name}
          <small>
            @
            {video?.performer?.username}
          </small>
        </div>
      </div>
      <div style={{ margin: '20px 0' }} />
      <Button type="primary" loading={submiting} disabled={submiting} onClick={() => onFinish()}>
        Unlock video for
        {' '}
        $
        {video.price.toFixed(2)}
      </Button>
    </div>
  );
}
