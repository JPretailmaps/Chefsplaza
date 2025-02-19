import { DeleteOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Image, Modal,
  Progress, Tooltip, Upload
} from 'antd';
import { useState } from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import style from './list-media.module.scss';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });

interface IProps {
  remove: Function;
  files: any[];
  onAddMore: Function;
  uploading: boolean;
  type: string;
}

export function UploadList({
  remove, files, onAddMore, uploading, type
}: IProps) {
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  return (
    <div className={classNames(
      style['f-upload-list']
    )}
    >
      {files && files.map((file) => (
        <div className={style['f-upload-item']} key={file._id || file.uid}>
          <div className={style['f-upload-thumb']}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {(file.type.includes('feed-photo') || file.type.includes('image'))
              ? <Image alt="img" src={file?.url || file?.thumbnail} width="100%" />
              : file.type.includes('video') ? (
                <div
                  style={{ backgroundImage: `url(${file?.thumbnail})` }}
                  className={style['f-thumb-vid']}
                  aria-hidden
                  onClick={() => {
                    if (!file?.url) return;
                    setIsShowPreview(true);
                    setPreviewUrl(file?.url);
                  }}
                >
                  <PlayCircleOutlined />
                </div>
              ) : <img alt="img" src="/no-image.jpg" width="100%" />}
          </div>
          {/* <div className={style['f-upload-name']}>
            <Tooltip title={file.name}>{file.name}</Tooltip>
          </div>
          <div className={style['f-upload-size']}>
            {(file.size / (1024 * 1024)).toFixed(2)}
            {' '}
            MB
          </div> */}
          {file.status !== 'uploading'
            && (
              <span className={style['f-remove']}>
                <Button type="primary" onClick={() => remove(file)}>
                  <DeleteOutlined />
                </Button>
              </span>
            )}
          {file.percent && <Progress percent={Math.round(file.percent)} />}
        </div>
      ))}
      {(type === 'photo' || (type === 'video' && !files.length)) && (
        <div className={style['add-more']}>
          <Upload
            customRequest={() => false}
            accept={type === 'video' ? 'video/*' : 'image/*'}
            beforeUpload={onAddMore.bind(this)}
            multiple={type === 'photo'}
            showUploadList={false}
            disabled={uploading}
            listType="picture"
          >
            <PlusOutlined />
            {' '}
            Add
            {' '}
            {/* eslint-disable-next-line no-nested-ternary */}
            {type === 'photo' ? 'photos' : type === 'video' ? 'video' : 'files'}
          </Upload>
        </div>
      )}
      {isShowPreview && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreview(false)}
          onCancel={() => setIsShowPreview(false)}
          open={isShowPreview}
          destroyOnClose
        >
          <VideoPlayer
            options={{
              autoplay: true,
              controls: true,
              playsinline: true,
              fluid: true,
              sources: [
                {
                  src: previewUrl,
                  type: 'video/mp4'
                }
              ]
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default UploadList;
