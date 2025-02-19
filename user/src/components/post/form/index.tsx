import {
  DeleteOutlined, PictureOutlined, PlayCircleOutlined, SmileOutlined, VideoCameraAddOutlined, UploadOutlined
} from '@ant-design/icons';
import UploadList from '@components/post/form/list-media';
import { feedService } from '@services/index';
import {
  Button, Col, DatePicker,
  Form, Image, Input, InputNumber, message, Modal, Popover, Progress, Radio,
  Row, Select, Upload
} from 'antd';
import moment from 'moment';
import getConfig from 'next/config';
import Router from 'next/router';
import { useReducer, useRef, useState } from 'react';
import { IFeed } from 'src/interfaces';
import dynamic from 'next/dynamic';
import { PreviewAudioPlayer, AudioRecorder } from '@components/file';
import { convertBlobUrlToFile } from '@lib/file';
import { validateMessages } from '@lib/message';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { getImageBase64, showError } from '@lib/utils';
import style from './form.module.scss';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });
const Emotions = dynamic(() => (import('@components/common/emotions')), { ssr: false });
const PollForm = dynamic(() => (import('../poll/poll-form')), { ssr: false });

const { TextArea } = Input;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  type: string;
  discard?: Function;
  feed?: IFeed
}

export function FeedForm({
  type, discard, feed
}: IProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>(feed?.files || []);
  const [fileIds, setFileIds] = useState<any[]>(feed?.fileIds || []);
  // eslint-disable-next-line no-nested-ternary
  const [intendedFor, setIntendedFor] = useState(!feed?.isSale ? 'subscriber' : feed?.isSale && feed?.price ? 'sale' : 'follower');
  const [text, setText] = useState(feed?.text);
  const [thumbnail, setThumbnail] = useState<any>(feed?.thumbnail);
  const [thumbnailId, setThumbnailId] = useState<string>(feed?.thumbnailId);
  const [thumbnailBlob, setThumbnailBlob] = useState<any>(null);
  const [streamingScheduled, setStreamingScheduled] = useState<any>(feed?.streamingScheduled ? dayjs(feed?.streamingScheduled) : dayjs().add(1, 'd').startOf('d'));
  const [teaser, setTeaser] = useState<any>(feed?.teaser);
  const [teaserId, setTeaserId] = useState<string>(feed?.teaserId);
  const [isShowPreviewTeaser, setIsShowPreviewTeaser] = useState<boolean>(false);
  const [openAudioRecorder, setOpenAudioRecorder] = useState(false);
  const [audioUrl, setAudioUrl] = useState((feed?.files && feed?.files[0] && feed?.files[0]?.url) || '');
  const [, setTimeRecord] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const pollList = useRef(feed?.polls || []);
  const expiredPollAt = useRef(feed?.pollExpiredAt || moment().endOf('day').add(7, 'days').toDate());

  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [formRef] = Form.useForm();

  const handleDeleteFile = (field: string) => {
    if (field === 'thumbnail') {
      setThumbnail(null);
      setThumbnailId(null);
    }
    if (field === 'teaser') {
      setTeaser(null);
      setTeaserId(null);
    }
  };

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    // eslint-disable-next-line no-param-reassign
    if (file.percent === 100) file.status = 'done';
    forceUpdate();
  };

  const removeFile = async (file) => {
    setFileList(fileList.filter((f) => f?._id !== file?._id || f?.uid !== file?.uid));
    setFileIds(fileIds.filter((id) => id !== file?._id));
  };

  const onEmojiClick = (emoji) => {
    setText(text ? `${text} ${emoji} ` : `${emoji} `);
  };

  const beforeUploadFiles = (file, listFile) => {
    if (listFile.indexOf(file) === (listFile.length - 1)) {
      listFile.forEach((f) => {
        if (f.type.includes('image')) {
          f.thumbnail = URL.createObjectURL(f);
        }
        if (f.type.includes('video')) {
          handleLoadPreviewVideo(file);
        }
        return f;
      });
      setFileList([...fileList, ...listFile]);
    }
  };

  const beforeUploadThumbnail = async (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const isLt2M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
    if (!isLt2M) {
      message.error(`File is too large please provide an image ${config.MAX_SIZE_IMAGE || 5}MB or below`);
      return false;
    }

    setThumbnailBlob(URL.createObjectURL(file));
    setThumbnail(file);
    return true;
  };

  const beforeUploadAudio = async (file) => {
    if (!(file.type).includes('audio') && !(file.type).includes('video')) {
      message.error('Only mp3 or mp4 files are uploaded');
      return false;
    }

    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = URL.createObjectURL(file);

    // eslint-disable-next-line func-names
    audio.onloadedmetadata = function () {
      window.URL.revokeObjectURL(audio.src);
      if (audio.duration <= 900.99) {
        if (fileList[0]) {
          setAudioUrl('');
          setFileList([]);
        }
        getImageBase64(file, (url) => {
          setAudioUrl(url);
        });
        setFileList([file]);
        return true;
      }
      message.error('The maximum duration of an audio file is 15 minutes');
      return false;
    };
    // audio.src = URL.createObjectURL(file);
    return true;
  };

  const beforeUploadRecord = async (blob) => {
    // delete if there are files
    if (fileList.length) {
      setAudioUrl('');
      setFileList([]);
    }
    const file = blob && await convertBlobUrlToFile(blob, `record_audio_${new Date().getTime()}`);
    setFileList([file]);
    setAudioUrl(blob);
  };

  const onStartStopRecord = (value) => {
    setIsRecord(value);
  };

  const onChangePolls = ({ polls, expiredAt }) => {
    pollList.current = polls;
    expiredPollAt.current = expiredAt;
  };

  const getTimeRecord = (timer) => {
    setTimeRecord(timer);
  };

  const beforeUploadteaser = async (file) => {
    const { publicRuntimeConfig: config } = getConfig();
    const isLt2M = file.size / 1024 / 1024 < (config.MAX_SIZE_TEASER || 200);
    if (!isLt2M) {
      message.error(`File is too large please provide an video ${config.MAX_SIZE_TEASER || 200}MB or below`);
      return false;
    }
    handleLoadPreviewVideo(file);
    setTeaser(file);
    return true;
  };

  const onSubmit = async (payload: any) => {
    const formValues = {
      ...payload,
      text
    };
    if (!text.trim()) {
      message.error('Please add a description.');
      return;
    }

    if (text.length > 500) {
      message.error('Description must be at lower 500 characters length.');
      return;
    }

    if (intendedFor !== 'subscriber' && formValues.price < 0) {
      message.error('Price must be greater than 0');
      return;
    }

    if (type === 'scheduled-streaming' && !streamingScheduled) {
      message.error('Please provide the date for Live streaming');
      return;
    }
    if (type === 'scheduled-streaming' && dayjs().isAfter(streamingScheduled)) {
      message.error('Please provide the date for Live streaming in the future');
      return;
    }

    if ((fileIds.length + fileList.length) > 12) {
      message.error('You can upload maximum 12 files.');
      return;
    }
    setUploading(true);
    // create polls
    let pollIds = feed?.pollIds || [];
    // update feed can't edit poll
    if (pollList.current.length >= 2 && !feed) {
      await pollList.current.reduce(async (lp, poll) => {
        await lp;
        if (!poll.trim() || poll?._id) return Promise.resolve();
        const resp = await feedService.addPoll({ description: poll?.description || poll, expiredAt: expiredPollAt.current });
        pollIds = [...pollIds, resp.data._id];
        return Promise.resolve();
      }, Promise.resolve());
    }
    // upload media
    let _fileIds = fileIds;
    if (fileList.length > 0) {
      await fileList.reduce(async (lp, fileItem) => {
        await lp;
        if (!['uploading', 'done'].includes(fileItem.status) && !fileItem._id) {
          try {
            const result = fileItem;
            result.status = 'uploading';
            let resp: any = {};
            if (type === 'photo') {
              resp = await feedService.uploadPhoto(result, {}, (r) => onUploading(result, r));
              _fileIds = [..._fileIds, ...[resp.data._id]];
            } else if (type === 'video') {
              resp = await feedService.uploadVideo(result, {}, (r) => onUploading(result, r));
              _fileIds = [resp.data._id];
            } else if (type === 'audio') {
              resp = await feedService.uploadAudio(result, {}, (r) => onUploading(result, r));
              _fileIds = [resp.data._id];
            }
            result._id = resp.data._id;
          } catch (e) {
            message.error(`File ${fileItem.name} error!`);
          }
        }
        return Promise.resolve();
      }, Promise.resolve());
    }
    if (['video', 'photo', 'audio'].includes(type) && !_fileIds.length) {
      message.error(`Please add ${type} file`);
      setUploading(false);
      return;
    }

    // upload teaser
    let _teaserId = teaserId;
    if (teaser && !teaser._id) {
      const resp = await feedService.uploadTeaser(teaser, {}, (r) => onUploading(teaser, r)) as any;
      _teaserId = resp.data._id;
    }
    // upload thumbnail
    let _thumbnailId = thumbnailId;
    if (thumbnail && !thumbnail._id) {
      const resp = await feedService.uploadThumbnail(thumbnail, {}, (r) => onUploading(thumbnail, r)) as any;
      _thumbnailId = resp.data._id;
    }

    formValues.isSale = intendedFor !== 'subscriber';
    formValues.pollIds = pollIds;
    formValues.pollExpiredAt = expiredPollAt.current;
    formValues.fileIds = _fileIds;
    formValues.teaserId = _teaserId;
    formValues.thumbnailId = _thumbnailId;
    formValues.type = type;
    formValues.streamingScheduled = streamingScheduled ? moment(streamingScheduled.toDate()).toISOString() : null;

    if (['text', 'scheduled-streaming'].includes(type)) {
      formValues.fileIds = [];
      formValues.teaserId = null;
      formValues.thumbnailId = null;
    }
    try {
      !feed ? await feedService.create(formValues) : await feedService.update(feed._id, formValues);
      message.success('Posted successfully!');
      Router.push('/creator/my-post');
    } catch (e) {
      showError(e);
      setUploading(false);
    }
  };

  const handleLoadPreviewVideo = (file) => {
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
  };

  return (
    <div className={classNames(style['feed-form'])}>
      <Form
        form={formRef}
        {...layout}
        onFinish={onSubmit}
        validateMessages={validateMessages}
        initialValues={feed || ({
          text: '',
          price: 4.99,
          isSale: false,
          status: 'active'
        })}
        scrollToFirstError
      >
        <Form.Item
          name="text"
          validateTrigger={['onChange', 'onBlur']}
          rules={[{ required: true, message: 'Please add a description' }]}
        >
          <div className={style['input-f-desc']}>
            <TextArea showCount value={text} onChange={(e) => setText(e.target.value)} className={style['feed-input']} minLength={1} maxLength={300} rows={3} placeholder={!fileIds.length ? 'Compose new post...' : 'Add a description'} allowClear />
            <Popover className="emotion-popover" content={<Emotions onEmojiClick={onEmojiClick} />} title={null} trigger="click">
              <span className={style['grp-emotions']}>
                <SmileOutlined />
              </span>
            </Popover>
          </div>
        </Form.Item>
        {['video', 'photo', 'audio'].includes(type) && (
          <Form.Item>
            <Radio.Group value={intendedFor} onChange={(e) => setIntendedFor(e.target.value)}>
              <Radio key="subscriber" value="subscriber">Only for Subscribers</Radio>
              <Radio key="sale" value="sale">Pay per View</Radio>
              <Radio key="follower" value="follower">Free for Everyone</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {intendedFor === 'sale' && (
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please add the price' }]}>
            <InputNumber min={1} />
          </Form.Item>
        )}
        {['video', 'photo'].includes(type) && (
          <Form.Item>
            <UploadList
              type={type}
              files={fileList}
              remove={removeFile}
              onAddMore={beforeUploadFiles}
              uploading={uploading}
            />
          </Form.Item>
        )}
        {['audio'].includes(type) && (
          <Form.Item>
            {audioUrl && (
              <div className={style['audio-wrapper']}>
                <div className={style['audio-file']}>
                  <PreviewAudioPlayer source={audioUrl} />
                </div>
                <Button
                  className={style['audio-remove']}
                  type="primary"
                  onClick={() => { removeFile(fileList[0]); setAudioUrl(null); }}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            )}
            <div className={style['audio-actions']}>
              <AudioRecorder
                getTimeRecord={getTimeRecord}
                isActive={openAudioRecorder}
                onStartStopRecord={onStartStopRecord}
                onFinish={(file) => beforeUploadRecord(file)}
                onClose={() => setOpenAudioRecorder(false)}
              />

              <Upload
                className={style['audio-upload-btn']}
                key="upload_record"
                customRequest={() => false}
                accept="audio/*, video/*"
                beforeUpload={beforeUploadAudio}
                maxCount={1}
                disabled={uploading || isRecord || openAudioRecorder}
                showUploadList={false}
              >
                <Button>
                  <UploadOutlined />
                  {' '}
                  Upload record
                </Button>
              </Upload>
            </div>
          </Form.Item>
        )}
        {['scheduled-streaming'].includes(type) && (
          <Form.Item
            label="Scheduled for streaming"
            extra={<div className="error-color">{`UTC: ${streamingScheduled ? moment(streamingScheduled.toDate()).utc().format('LLL') : ''}`}</div>}
          >
            <DatePicker
              showNow={false}
              showTime={{ format: 'HH:mm' }}
              onChange={(v) => setStreamingScheduled(v)}
              disabledDate={(current) => current && current < dayjs().add(1, 'day').startOf('day')}
              defaultValue={streamingScheduled}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}
        <PollForm feed={feed} onChange={onChangePolls} />
        <Row>
          {thumbnail && (thumbnail?.url || thumbnailBlob) && (
            <Col md={12} xs={12}>
              <Form.Item label="Thumbnail" className="text-center">
                <div className={style['thumb-previews']}>
                  <Button
                    type="primary"
                    onClick={() => handleDeleteFile('thumbnail')}
                  >
                    <DeleteOutlined />
                  </Button>
                  <Image alt="thumbnail" src={thumbnail?.url || thumbnailBlob} />
                </div>
              </Form.Item>
            </Col>
          )}
          {teaser && (
            <Col md={12} xs={12}>
              <Form.Item label="Teaser">
                <div
                  className={style['teaser-previews']}
                  aria-hidden
                  onClick={() => setIsShowPreviewTeaser(!!teaser?._id)}
                  style={{ backgroundImage: `url(${teaser.thumbnail})` }}
                >
                  <PlayCircleOutlined />
                  <Button className={style['f-remove']} type="primary" onClick={() => handleDeleteFile('teaser')}>
                    <DeleteOutlined />
                  </Button>
                </div>
                {teaser.percent ? <Progress percent={Math.round(teaser.percent)} /> : null}
              </Form.Item>
            </Col>
          )}
        </Row>
        <div className={style['submit-btns']}>
          {['video', 'photo', 'audio', 'scheduled-streaming'].includes(type) && [
            <Upload
              key="upload_thumb"
              customRequest={() => true}
              accept={'image/*'}
              beforeUpload={beforeUploadThumbnail}
              multiple={false}
              showUploadList={false}
              disabled={uploading}
              listType="picture"
            >
              <Button type="primary">
                <PictureOutlined />
                {' '}
                Add thumbnail
              </Button>
            </Upload>
          ]}
          {['video'].includes(type) && [
            <Upload
              key="upload_teaser"
              customRequest={() => true}
              accept={'video/*'}
              beforeUpload={beforeUploadteaser}
              multiple={false}
              showUploadList={false}
              disabled={uploading}
              listType="picture"
            >
              <Button type="primary">
                <VideoCameraAddOutlined />
                {' '}
                Add teaser
              </Button>
            </Upload>
          ]}
        </div>
        {feed && (
          <Form.Item
            name="status"
            label="Status"
          >
            <Select>
              <Select.Option key="active" value="active">
                Active
              </Select.Option>
              <Select.Option key="inactive" value="inactive">
                Inactive
              </Select.Option>
            </Select>
          </Form.Item>
        )}
        <div className={style['submit-btns']}>
          <Button
            className="primary"
            htmlType="submit"
            loading={uploading}
            disabled={uploading}
            style={{ marginTop: 5 }}
          >
            SUBMIT
          </Button>
          {(!feed || !feed._id) && (
            <Button
              onClick={() => discard()}
              className="secondary"
              disabled={uploading}
              style={{ marginTop: 5 }}
            >
              DISCARD
            </Button>
          )}
        </div>
      </Form>
      {isShowPreviewTeaser && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreviewTeaser(false)}
          onCancel={() => setIsShowPreviewTeaser(false)}
          open={isShowPreviewTeaser}
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
                  src: teaser?.url,
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

FeedForm.defaultProps = {
  feed: null,
  discard: () => { }
};

export default FeedForm;
