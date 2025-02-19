/* eslint-disable no-await-in-loop */
import {
  useState, useReducer, useRef
} from 'react';
import {
  DatePicker, Upload, message, Button, Tooltip, Select, Image,
  Input, Form, InputNumber, Radio, Progress, Modal
} from 'antd';
import {
  BarChartOutlined, PictureOutlined, VideoCameraAddOutlined,
  PlayCircleOutlined, DeleteOutlined, UploadOutlined
} from '@ant-design/icons';
import UploadList from '@components/file/list-media';
import { IFeed } from 'src/interfaces';
import { feedService } from '@services/index';
import Router from 'next/router';
import moment from 'moment';
import { formatDate } from '@lib/date';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import getConfig from 'next/config';
import { VideoPlayer } from '@components/common';
import { convertBlobUrlToFile, getBase64 } from '@lib/file';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { showError } from '@lib/message';
import AddPollDurationForm from './add-poll-duration';
import style from './feed-form.module.scss';

const PreviewAudioPlayer = dynamic(() => (import('@components/file/preview-audio-player')), { ssr: false });
const AudioRecorder = dynamic(() => (import('@components/file/audio-recorder')), { ssr: false });

const { TextArea } = Input;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
interface IProps {
  feed?: IFeed;
  onDelete?: Function;
}
const validateMessages = {
  required: 'This field is required!'
};

function FormFeed({ feed, onDelete }: IProps) {
  const [formRef] = Form.useForm();

  const pollIds = useRef(feed?.pollIds || []);

  const thumbnailId = useRef(feed?.teaserId || null);

  const teaserId = useRef(feed?.thumbnailId || null);

  const audio = feed?.files && (feed?.files || []).find((f) => f.type.includes('audio'));

  const [type, setType] = useState(feed?.type || 'text');
  const [uploading, setUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState(feed?.thumbnail || null) as any;
  const [thumbnailPreview, setThumbnailPreview] = useState(feed?.thumbnail?.url || '') as any;
  const [teaser, setTeaser] = useState(feed?.teaser || null) as any;
  const [fileList, setFileList] = useState(feed?.files ? feed?.files : []);
  const [fileIds, setFileIds] = useState(feed?.fileIds ? feed?.fileIds : []);
  const [pollList, setPollList] = useState(feed?.polls || []);
  const [addPoll, setAddPoll] = useState(!!feed?.pollIds?.length || false);
  const [openPollDuration, setOpenPollDuration] = useState(false);
  const [expirePollTime, setExpirePollTime] = useState(7);
  const [expiredPollAt, setExpiredPollAt] = useState(moment().endOf('day').add(7, 'days'));
  // eslint-disable-next-line no-nested-ternary
  const [intendedFor, setIntendedFor] = useState(!feed?.isSale ? 'subscriber' : feed?.isSale && feed?.price ? 'sale' : 'follower');
  const [isShowPreviewTeaser, setIsShowPreviewTeaser] = useState(false);
  const [openAudioRecorder, setOpenAudioRecorder] = useState(false);
  const [audioUrl, setAudioUrl] = useState(audio?.url || '');
  const [streamingScheduled, setStreamingScheduled] = useState<any>(feed?.streamingScheduled ? dayjs(feed?.streamingScheduled) : dayjs().add(1, 'd').startOf('d'));
  // const [, setTimeRecord] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleDeleteFile = (field: string) => {
    if (field === 'thumbnail') {
      setThumbnail(null);
      setThumbnailPreview('');
      thumbnailId.current = null;
    }
    if (field === 'teaser') {
      setTeaser(null);
      teaserId.current = null;
    }
  };

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    // eslint-disable-next-line no-param-reassign
    if (file.percent === 100) file.status = 'done';
    forceUpdate();
  };

  const onAddPoll = async () => {
    setAddPoll(!addPoll);
    if (!addPoll) {
      pollIds.current = [];
      setPollList([]);
    }
  };

  const onChangePoll = async (index, e) => {
    const { value } = e.target;
    const newItems = [...pollList];
    newItems[index] = value;
    setPollList(newItems);
  };

  const beforeUploadAudio = async (file) => {
    if (!(file.type).includes('audio') && !(file.type).includes('video')) {
      message.error('Only mp3 or mp4 files are uploaded');
      return false;
    }

    const _audio = document.createElement('audio');
    _audio.preload = 'metadata';
    _audio.src = URL.createObjectURL(file);

    // eslint-disable-next-line func-names
    _audio.onloadedmetadata = function () {
      window.URL.revokeObjectURL(_audio.src);
      if (_audio.duration <= 900.99) {
        if (fileList[0]) {
          setAudioUrl('');
          setFileList([]);
        }
        getBase64(file, (url) => {
          setAudioUrl(url);
        });
        setFileList([file]);
        return true;
      }
      message.error('The maximum duration of an audio file is 15 minutes');
      return false;
    };
    return true;
  };

  const beforeUploadRecord = async (blob) => {
    // delete if there are files
    if (fileList[0]) {
      setAudioUrl('');
      setFileList([]);
    }
    const file = blob && await convertBlobUrlToFile(blob, `record_audio_${new Date().getTime()}`);
    setFileList([file]);
    setAudioUrl(blob);
    return true;
  };

  const onStartStopRecord = (value) => {
    setIsRecord(value);
  };

  const getTimeRecord = (timer) => {
    console.log(timer);
  };

  const onChangePollDuration = async (numberDays) => {
    const date = !numberDays ? moment().endOf('day').add(99, 'years') : moment().endOf('day').add(numberDays, 'days');
    setOpenPollDuration(false);
    setExpiredPollAt(date);
    setExpirePollTime(numberDays);
  };

  const onClearPolls = async () => {
    setPollList([]);
    pollIds.current = [];
  };

  const setFormVal = async (field: string, val: any) => {
    formRef.setFieldsValue({
      [field]: val
    });
  };

  const remove = async (file) => {
    setFileList(fileList.filter((f) => (f._id ? f._id !== file._id : f.uid !== file.uid)));
    setFileIds(fileIds.filter((id) => id !== file?._id));
  };

  const beforeUploadFiles = async (file, listFile) => {
    const { publicRuntimeConfig: config } = getConfig();
    if (file.type.includes('image')) {
      const valid = (file.size / 1024 / 1024) < (config.MAX_SIZE_IMAGE || 5);
      if (!valid) {
        message.error(`Image ${file.name} must be smaller than ${config.MAX_SIZE_IMAGE || 5}MB!`);
        return false;
      }
    }
    if (file.type.includes('video')) {
      const valid = (file.size / 1024 / 1024) < (config.MAX_SIZE_TEASER || 200);
      if (!valid) {
        message.error(`Video ${file.name} must be smaller than ${config.MAX_SIZE_TEASER || 200}MB!`);
        return false;
      }
    }
    if (listFile.indexOf(file) === (listFile.length - 1)) {
      setFileList([...fileList, ...listFile]);
    }
    return true;
  };

  const beforeUploadThumbnail = async (file) => {
    if (!file) {
      return false;
    }
    const { publicRuntimeConfig: config } = getConfig();
    const isLt2M = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
    if (!isLt2M) {
      message.error(`File is too large please provide an image ${config.MAX_SIZE_IMAGE || 5}MB or below`);
      return false;
    }
    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnail(file);
    return true;
  };

  const beforeUploadteaser = async (file) => {
    if (!file) {
      return false;
    }
    const { publicRuntimeConfig: config } = getConfig();
    const isLt2M = file.size / 1024 / 1024 < (config.MAX_SIZE_TEASER || 200);
    if (!isLt2M) {
      message.error(`File is too large please provide an video ${config.MAX_SIZE_TEASER || 200}MB or below`);
      return false;
    }
    setTeaser(file);
    return true;
  };

  const submit = async (payload: any) => {
    try {
      const formValues = payload;
      if (!formValues.text || !formValues.text.trim()) {
        message.error('Please add a description');
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
      if (intendedFor !== 'subscriber' && formValues.price < 0) {
        message.error('Price must be greater than 0');
        return;
      }
      if (['video', 'photo', 'audio'].includes(type) && !fileList.length) {
        message.error(`Please add ${type} file`);
        return;
      }
      setUploading(true);
      // upload polls
      if (addPoll && pollList.length < 2) {
        message.error('Polls must have at least 2 options');
        return;
      } if (addPoll && pollList.length >= 2) {
        // eslint-disable-next-line no-restricted-syntax
        for (const poll of pollList) {
          // eslint-disable-next-line no-continue
          if (!poll.length || poll._id) continue;
          const resp = await feedService.addPoll({
            description: poll,
            expiredAt: expiredPollAt
          });
          if (resp && resp.data) {
            pollIds.current = [...pollIds.current, resp.data._id];
          }
        }
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

      // upload teaser
      let _teaserId = teaserId.current;
      if (teaser && !teaser._id) {
        const resp = await feedService.uploadTeaser(teaser, {}, (r) => onUploading(teaser, r)) as any;
        _teaserId = resp.data._id;
      }
      // upload thumbnail
      let _thumbnailId = thumbnailId.current;
      if (thumbnail && !thumbnail._id) {
        const resp = await feedService.uploadThumbnail(thumbnail, {}, (r) => onUploading(thumbnail, r)) as any;
        _thumbnailId = resp.data._id;
      }

      formValues.pollIds = pollIds.current;
      formValues.pollExpiredAt = expiredPollAt;
      formValues.fileIds = _fileIds;
      formValues.teaserId = _teaserId;
      formValues.thumbnailId = _thumbnailId;
      formValues.isSale = intendedFor !== 'subscriber';
      formValues.streamingScheduled = streamingScheduled ? moment(streamingScheduled.toDate()).toISOString() : null;
      if (['text', 'scheduled-streaming'].includes(type)) {
        formValues.fileIds = [];
        formValues.teaserId = null;
        formValues.thumbnailId = null;
      }
      !feed ? await feedService.create({ ...formValues, type }) : await feedService.update(feed._id, { ...formValues, type });
      message.success(`${!feed ? 'Posted' : 'Updated'} successfully!`);
      Router.push('/feed');
    } catch (e) {
      showError(e);
      setUploading(false);
    }
  };

  return (
    <div className={style['feed-form']}>
      <Form
        {...layout}
        form={formRef}
        onFinish={(values) => {
          submit(values);
        }}
        validateMessages={validateMessages}
        initialValues={feed || ({
          type: 'text',
          text: '',
          price: 4.99
        })}
      >
        <Form.Item
          name="fromSourceId"
          label="Select creator"
          rules={[
            { required: true, message: 'Please select a creator!' }]}
        >
          <SelectPerformerDropdown
            defaultValue={(feed?.fromSourceId || '')}
            onSelect={(val) => setFormVal('fromSourceId', val)}
          />
        </Form.Item>
        <Form.Item name="type" label="Select post type" rules={[{ required: true }]}>
          <Select onChange={(val) => setType(val)}>
            <Select.Option value="text">Text</Select.Option>
            <Select.Option value="video">Video</Select.Option>
            <Select.Option value="photo">Photos</Select.Option>
            <Select.Option value="audio">Audio</Select.Option>
            <Select.Option value="scheduled-streaming">Scheduled streaming</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Add description" name="text" rules={[{ required: true, message: 'Please add a description' }]}>
          <TextArea className={style['feed-input']} rows={3} placeholder="Add a description" allowClear />
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
          <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please add a price' }]}>
            <InputNumber min={1} />
          </Form.Item>
        )}
        {thumbnail && (
          <Form.Item label="Thumbnail">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Button type="primary" onClick={() => handleDeleteFile('thumbnail')} style={{ position: 'absolute', top: 2, right: 2 }}><DeleteOutlined /></Button>
              <Image alt="thumbnail" src={thumbnailPreview} width="200px" />
            </div>
          </Form.Item>
        )}
        {teaser && (
          <Form.Item label="Teaser">
            <div className={style['f-upload-list']}>
              <div className={style['f-upload-item']}>
                <div
                  aria-hidden
                  className={style['f-upload-thumb']}
                  onClick={() => setIsShowPreviewTeaser(!!teaser)}
                >
                  <span className={style['f-thumb-vid']}>
                    <PlayCircleOutlined />
                  </span>
                </div>
                <div className={style['f-upload-name']}>
                  <Tooltip title={teaser?.name}>{teaser?.name}</Tooltip>
                </div>
                <div className={style['f-upload-size']}>
                  {(teaser.size / (1024 * 1024)).toFixed(2)}
                  {' '}
                  MB
                </div>
                <span className={style['f-remove']}>
                  <Button type="primary" onClick={() => handleDeleteFile('teaser')}>
                    <DeleteOutlined />
                  </Button>
                </span>
                {teaser.percent && <Progress percent={Math.round(teaser.percent)} />}
              </div>
            </div>
          </Form.Item>
        )}
        {addPoll
          && (
            <Form.Item label="Add Polls">
              <div className={style['poll-form']}>
                <div className={style['poll-top']}>
                  {!feed ? (
                    <>
                      <span aria-hidden="true" onClick={() => setOpenPollDuration(true)}>
                        Poll duration -
                        {' '}
                        {!expirePollTime ? 'No limit' : `${expirePollTime} days`}
                      </span>
                      <a aria-hidden="true" onClick={() => onAddPoll()}>x</a>
                    </>
                  )
                    : (
                      <span>
                        Poll expiration
                        {' '}
                        {formatDate(feed?.pollExpiredAt)}
                      </span>
                    )}
                </div>
                <Form.Item
                  name="pollDescription"
                  className={style['form-item-no-pad']}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please add a question' }
                  ]}
                >
                  <Input placeholder="Question" />
                </Form.Item>
                {/* eslint-disable-next-line no-nested-ternary */}
                <Input disabled={!!feed?._id} className={style['poll-input']} placeholder="Poll 1" value={pollList && pollList.length > 0 && pollList[0]._id ? pollList[0].description : pollList[0] ? pollList[0] : ''} onChange={onChangePoll.bind(this, 0)} />
                {/* eslint-disable-next-line no-nested-ternary */}
                <Input disabled={!!feed?._id || !pollList.length} className={style['poll-input']} placeholder="Poll 2" value={pollList && pollList.length > 1 && pollList[1]._id ? pollList[1].description : pollList[1] ? pollList[1] : ''} onChange={onChangePoll.bind(this, 1)} />

                {pollList.map((poll, index) => {
                  if (index === 0 || index === 1) return null;
                  // eslint-disable-next-line react/no-array-index-key
                  return <Input disabled={!!feed?._id} key={`poll_${index}`} placeholder={`Poll ${index + 1}`} value={(poll._id ? poll.description : poll) || ''} className={style['poll-input']} onChange={onChangePoll.bind(this, index)} />;
                })}
                {!feed && pollList.length > 1 && (
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <a aria-hidden onClick={() => setPollList(pollList.concat(['']))}>Add another option</a>
                    <a aria-hidden onClick={() => onClearPolls()}>
                      Clear polls
                    </a>
                  </p>
                )}
              </div>
            </Form.Item>
          )}
        {['audio'].includes(type) && (
          <Form.Item>
            {audioUrl && (
              <div className={style['audio-wrapper']}>
                <div className={style['audio-file']}>
                  <PreviewAudioPlayer source={audioUrl} />
                  <Button
                    className={style['audio-remove']}
                    type="primary"
                    onClick={() => { remove(fileList[0]); setAudioUrl(null); }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
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
        {['photo', 'video'].includes(type) && (
          <Form.Item label={type === 'video' ? 'Video' : 'Photos'}>
            <UploadList
              type={type}
              files={fileList}
              remove={remove}
              onAddMore={beforeUploadFiles}
              uploading={uploading}
            />
          </Form.Item>
        )}
        {['scheduled-streaming'].includes(type) && (
          <Form.Item
            label="Scheduled for streaming"
            extra={<div className="highlight-color">{`The value will be converted to UTC: ${streamingScheduled ? moment(streamingScheduled.toDate()).utc().format('lll') : ''}`}</div>}
          >
            <DatePicker
              showNow={false}
              showTime={{ format: 'HH:mm' }}
              onChange={(v) => setStreamingScheduled(v)}
              disabledDate={(current) => current && current < dayjs().add(1, 'day').startOf('day')}
              value={streamingScheduled}
            />
          </Form.Item>
        )}
        <div style={{ margin: '15px 0' }}>
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
                Add Thumbnail
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
              <Button type="primary" style={{ marginLeft: 15 }}>
                <VideoCameraAddOutlined />
                {' '}
                Add Teaser
              </Button>
            </Upload>
          ]}
          <Button disabled={addPoll || (!!(feed && feed._id))} type="primary" style={{ marginLeft: '15px' }} onClick={() => onAddPoll()}>
            <BarChartOutlined style={{ transform: 'rotate(90deg)' }} />
            {' '}
            Add Polls
          </Button>
        </div>
        <AddPollDurationForm onAddPollDuration={onChangePollDuration} openDurationPollModal={openPollDuration} />
        <div className={style['submit-btns']}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: '20px', width: '150px' }}
            loading={uploading}
            disabled={uploading}
          >
            {!feed ? 'POST' : 'UPDATE'}
          </Button>
          {feed && (
            <Button
              style={{ marginRight: '20px', width: '100px' }}
              loading={uploading}
              disabled={uploading}
              onClick={() => onDelete(feed._id)}
            >
              Delete
            </Button>
          )}
          <Button
            style={{ width: '100px' }}
            onClick={() => Router.back()}
            loading={uploading}
            disabled={uploading}
          >
            Discard
          </Button>
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
            {...{
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

FormFeed.defaultProps = {
  feed: null,
  onDelete: () => { }
};

export default FormFeed;
