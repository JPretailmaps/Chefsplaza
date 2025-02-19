/* eslint-disable no-nested-ternary */
import {
  useEffect, useState, useReducer
} from 'react';
import {
  PlusOutlined, PlayCircleOutlined, DeleteOutlined, DownOutlined
} from '@ant-design/icons';
import {
  Progress, Button, Upload, Tooltip, message, Image
} from 'antd';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import classNames from 'classnames';
import { getImageBase64 } from '@lib/utils';
import style from './MessageUploadMedia.module.scss';

const { publicRuntimeConfig: config } = getConfig();

const VideoPlayerViewModal = dynamic(
  () => import('@components/messages/modal/video-player-view'),
  { ssr: false }
);

interface IProps {
  onFilesSelected: Function;
  onClose: Function;
}

function MessageUploadMedia({
  onFilesSelected, onClose
}: IProps) {
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const onBeforeUpload = async (file: any, _files: any) => {
    if (!file.type.includes('image') && !file.type.includes('video')) {
      message.error('You can only upload photos  and videos!');
      return false;
    }
    const slFiles = [...files, ..._files].slice(0, 6); // limit 10
    // upload photo
    if (slFiles.indexOf(file) > -1 && file.type.includes('image')) {
      const valid = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 100);
      if (!valid) {
        message.error(
          `Photo ${file.name} must be less than ${config.MAX_SIZE_IMAGE || 100}MB!`
        );
        return false;
      }
      getImageBase64(file, (fileUrl) => {
        // eslint-disable-next-line no-param-reassign
        file.url = fileUrl;
        forceUpdate();
      });
    }
    // upload video
    if (slFiles.indexOf(file) > -1 && file.type.includes('video')) {
      const valid = file.size / 1024 / 1024 < (config.MAX_SIZE_VIDEO || 5000);
      if (!valid) {
        message.error(`Video ${file.name} must be less than ${config.MAX_SIZE_VIDEO || 5000}MB!`);
        return false;
      }
      const video = document.createElement('video');
      const blobUrl = URL.createObjectURL(file);
      video.src = blobUrl;
      file.url = blobUrl;
      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;

      video.addEventListener('loadeddata', () => {
        setTimeout(() => {
          video.currentTime = 0;
        }, 1000);
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 120;
        canvas.height = 180;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // eslint-disable-next-line no-param-reassign
        file.thumbnail = canvas.toDataURL();
        forceUpdate();
      });
    }
    if (slFiles.indexOf(file) === slFiles.length - 1) {
      if ([...files, ..._files].length > 6) {
        message.error('You can only upload maxmimum 6 photos & videos!');
      }
      setFiles(slFiles);
      onFilesSelected(slFiles);
    }

    return true;
  };

  const onRemoveFileMedia = (file) => {
    setFiles(files.filter((f) => f.uid !== file.uid));
    onFilesSelected(files.filter((f) => f.uid !== file.uid));
  };

  useEffect(() => {
    setFiles([]);
    onFilesSelected([]);
  }, []);

  return (
    <>
      <div className={classNames(style['message-upload-list'])}>
        <Button className={style['close-btn']} onClick={() => onClose()}><DownOutlined /></Button>
        {files.length > 0 && files.map((file) => (
          <div className={style['f-upload-item']} key={file._id || file.uid}>
            {/* upload photo */}
            {file.type.includes('image') && <Image alt="img" src={file?.url || file?.thumbnail} width="100%" />}
            {/* upload video */}
            {file.type.includes('video') && (
              <div
                className={style['f-upload-preview-vid']}
                onClick={() => {
                  if (!file.url) return;
                  setPreviewUrl(file.url);
                }}
                style={file?.thumbnail ? { backgroundImage: `url(${file.thumbnail})` } : {}}
              >
                <PlayCircleOutlined />
              </div>
            )}
            {file.status !== 'uploading' && (
              <Tooltip title="Remove">
                <Button
                  type="primary"
                  onClick={() => onRemoveFileMedia(file)}
                  className={style['f-remove']}
                >
                  <DeleteOutlined className="default-icon" />
                </Button>
              </Tooltip>
            )}
            {file.percent && <Progress percent={Math.round(file.percent)} />}
          </div>
        ))}
        {!(files?.length >= 6) && (
          <div className={style['add-more']}>
            <Upload
              maxCount={6}
              customRequest={() => true}
              accept={'video/*,image/*'}
              beforeUpload={onBeforeUpload}
              multiple
              showUploadList={false}
              listType="picture"
            >
              <PlusOutlined />
            </Upload>
          </div>
        )}
      </div>

      {!!previewUrl && (
        <VideoPlayerViewModal
          key="preview_video"
          title="Preview video"
          src={previewUrl}
          isOpenVideoPlayer={!!previewUrl}
          handleCancel={() => setPreviewUrl('')}
          width={600}
        />
      )}
    </>

  );
}

export default MessageUploadMedia;
