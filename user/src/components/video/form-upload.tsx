import {
  CameraOutlined, DeleteOutlined,
  FileDoneOutlined, VideoCameraAddOutlined
} from '@ant-design/icons';
import { performerService, videoService } from '@services/index';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Switch,
  Upload
} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import getConfig from 'next/config';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { IPerformer, IVideo } from 'src/interfaces/index';
import dynamic from 'next/dynamic';
import { ImageWithFallback } from '@components/common';
import { validateMessages } from '@lib/message';
import { showError } from '@lib/utils';
import style from './form-upload.module.scss';

const VideoPlayer = dynamic(() => (import('@components/video/player/video-player')), { ssr: false });

interface IProps {
  user: IPerformer;
  video?: IVideo;
  submit: Function;
  beforeUpload: Function;
  uploading: boolean;
  uploadPercentage: number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const { Option } = Select;

export function FormUploadVideo(props: IProps) {
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewTeaser, setPreviewTeaser] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTeaser, setSelectedTeaser] = useState(null);
  const [isSale, setIsSale] = useState(false);
  const [isSchedule, setIsSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(dayjs());
  const [performers, setPerformers] = useState([]);
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewType, setPreviewType] = useState('');
  const [removedTeaser, setRemovedTeaser] = useState(false);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);

  const getPerformers = debounce(async (q, performerIds) => {
    try {
      const resp = await (
        await performerService.search({
          q,
          performerIds: performerIds || '',
          limit: 99
        })
      );
      setPerformers(resp.data.data);
    } catch (e) {
      showError(e);
    }
  }, 500);

  useEffect(() => {
    const { video, user } = props;
    if (video) {
      setPreviewThumbnail(video?.thumbnail);
      setPreviewVideo(video?.video);
      setPreviewTeaser(video?.teaser);
      setIsSale(video.isSale);
      setIsSchedule(video.isSchedule);
      setScheduledAt(video.scheduledAt ? dayjs(video.scheduledAt) : dayjs());
    }
    getPerformers('', video?.participantIds || [user._id]);
  }, []);

  const handleRemoveFile = async (type: string) => {
    if (!window.confirm('Confirm to remove file!')) return;
    const { video } = props;
    try {
      await videoService.deleteFile(video._id, type);
      type === 'teaser' && setRemovedTeaser(true);
      type === 'thumbnail' && setRemovedThumbnail(true);
    } catch (e) {
      showError(e);
    }
  };

  const beforeUpload = (file: File, field: string) => {
    const { beforeUpload: beforeUploadHandler } = props;
    const { publicRuntimeConfig: config } = getConfig();
    if (field === 'thumbnail') {
      const isValid = file.size / 1024 / 1024 < (config.MAX_SIZE_IMAGE || 5);
      if (!isValid) {
        message.error(`File is too large please provide an file ${config.MAX_SIZE_IMAGE || 5}MB or below`);
        return isValid;
      }
      setSelectedThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    }
    if (field === 'teaser') {
      const isValid = file.size / 1024 / 1024 < (config.MAX_SIZE_TEASER || 200);
      if (!isValid) {
        message.error(`File is too large please provide an file ${config.MAX_SIZE_TEASER || 200}MB or below`);
        return isValid;
      }
      setSelectedTeaser(file);
    }
    if (field === 'video') {
      const isValid = file.size / 1024 / 1024 < (config.MAX_SIZE_VIDEO || 2000);
      if (!isValid) {
        message.error(`File is too large please provide an file ${config.MAX_SIZE_VIDEO || 2000}MB or below`);
        return isValid;
      }
      setSelectedVideo(file);
    }
    return beforeUploadHandler(file, field);
  };

  const {
    video, submit, uploading, uploadPercentage, user
  } = props;
  const { publicRuntimeConfig: config } = getConfig();

  return (
    <div className={classNames(style['video-form'])}>
      <Form
        {...layout}
        onFinish={(values) => {
          const data = values;
          if (isSchedule) {
            data.scheduledAt = scheduledAt;
          }
          if (values.tags && values.tags.length) {
            data.tags = values.tags.map((tag) => tag.replace(/[^a-zA-Z0-9 ]/g, '_'));
          }
          submit(data);
        }}
        name="form-upload"
        validateMessages={validateMessages}
        initialValues={
          video || {
            title: '',
            price: 9.99,
            description: '',
            tags: [],
            isSale: false,
            participantIds: [user._id],
            isSchedule: false,
            status: 'active'
          }
        }
        scrollToFirstError
      >
        <Row>
          <Col md={24} xs={24}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: 'Please input title of video!' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={24} xs={24}>
            <Form.Item label="Participants" name="participantIds">
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                showSearch
                placeholder="Search performers here"
                optionFilterProp="children"
                onSearch={(q) => getPerformers(q, user._id)}
                loading={uploading}
                defaultValue={video?.participantIds || []}
              >
                {performers
                  && performers.length > 0
                  && performers.map((p) => (
                    <Option key={p._id} value={p._id}>
                      <Avatar src={p?.avatar || '/no-avatar.jpg'} />
                      {' '}
                      {p?.name || p?.username || 'N/A'}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item label="Tags" name="tags">
              <Select
                mode="tags"
                style={{ width: '100%' }}
                size="middle"
                showArrow={false}
                defaultValue={video?.tags || []}
              />
            </Form.Item>
          </Col>
          <Col md={12} xs={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
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
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="isSale" label="For sale?">
              <Switch
                checkedChildren="Pay per view"
                unCheckedChildren="Subscribe to view"
                checked={isSale}
                onChange={(val) => setIsSale(val)}
              />
            </Form.Item>
            {isSale && (
              <Form.Item name="price" label="Price">
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            )}
          </Col>
          <Col md={12} xs={24}>
            <Form.Item name="isSchedule" label="Scheduled?">
              <Switch
                checkedChildren="Scheduled"
                unCheckedChildren="Not scheduled"
                checked={isSchedule}
                onChange={(val) => setIsSchedule(val)}
              />
            </Form.Item>
            {isSchedule && (
              <Form.Item label="Scheduled for">
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(currentDate) => currentDate && currentDate < dayjs().endOf('day')}
                  defaultValue={scheduledAt}
                  onChange={(val) => setScheduledAt(dayjs(val))}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Video"
              className={classNames(
                style['upload-bl']
              )}
              help={
                (previewVideo && (
                  <a
                    aria-hidden
                    onClick={() => { setIsShowPreview(true); setPreviewUrl(previewVideo?.url); setPreviewType('video'); }}
                  >
                    {previewVideo?.name || 'Click here to preview'}
                  </a>
                ))
                || (selectedVideo && <a>{selectedVideo.name}</a>)
                || `Video file is ${config.MAX_SIZE_VIDEO || 2048}MB or below`
              }
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="video/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => beforeUpload(file, 'video')}
              >
                {selectedVideo ? (
                  <FileDoneOutlined />
                ) : (
                  <VideoCameraAddOutlined />
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Teaser"
              className={classNames(
                style['upload-bl']
              )}
              help={
                (previewTeaser && !removedTeaser && (
                  <a
                    aria-hidden
                    onClick={() => { setIsShowPreview(true); setPreviewUrl(previewVideo?.url); setPreviewType('teaser'); }}
                  >
                    {previewTeaser?.name || 'Click here to preview'}
                  </a>
                ))
                || (selectedTeaser && <a>{selectedTeaser.name}</a>)
                || `Teaser is ${config.MAX_SIZE_TEASER || 200}MB or below`
              }
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="video/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => beforeUpload(file, 'teaser')}
              >
                {selectedTeaser ? (
                  <FileDoneOutlined />
                ) : (
                  <VideoCameraAddOutlined />
                )}
              </Upload>
              {video?.teaserId && !removedTeaser && <Button className={style['remove-btn']} type="primary" onClick={() => handleRemoveFile('teaser')}><DeleteOutlined /></Button>}
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              className={classNames(
                style['upload-bl']
              )}
              label="Thumbnail"
              help={
                (previewThumbnail && !removedThumbnail && (
                  <a
                    aria-hidden
                    onClick={() => {
                      setIsShowPreview(true);
                      setPreviewUrl(previewThumbnail?.url);
                      setPreviewType('thumbnail');
                    }}
                  >
                    {previewThumbnail?.name || 'Click here to preview'}
                  </a>
                ))
                || (selectedThumbnail && <a>{selectedThumbnail.name}</a>)
                || `Thumbnail is ${config.MAX_SIZE_IMAGE || 5}MB or below`
              }
            >
              <Upload
                listType="picture-card"
                className="avatar-uploader"
                accept="image/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => beforeUpload(file, 'thumbnail')}
              >
                {selectedThumbnail ? (
                  <FileDoneOutlined />
                ) : (
                  <CameraOutlined />
                )}
              </Upload>
              {video?.thumbnailId && !removedThumbnail && <Button className={style['remove-btn']} type="primary" onClick={() => handleRemoveFile('thumbnail')}><DeleteOutlined /></Button>}
            </Form.Item>
          </Col>
        </Row>
        {uploadPercentage ? (
          <Progress percent={Math.round(uploadPercentage)} />
        ) : null}
        <Form.Item wrapperCol={{ ...layout.wrapperCol }} className={style['button-form']} style={{ padding: '0 5px' }}>
          <Button
            className="primary"
            htmlType="submit"
            loading={uploading}
            disabled={uploading}
          >
            {video ? 'Update' : 'Upload'}
          </Button>
          <Button
            className="secondary"
            onClick={() => Router.back()}
            disabled={uploading}
          >
            Back
          </Button>
        </Form.Item>
      </Form>
      {isShowPreview && (
        <Modal
          width={767}
          footer={null}
          onOk={() => setIsShowPreview(false)}
          onCancel={() => setIsShowPreview(false)}
          open={isShowPreview}
          destroyOnClose
        >
          {['teaser', 'video'].includes(previewType) && (
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
          )}
          {previewType === 'thumbnail' && (
            <ImageWithFallback
              options={{
                width: 200,
                height: 200,
                style: { borderRadius: 5, width: '100%', objectFit: 'cover' }
              }}
              src={previewUrl}
              alt="thumbnail"
            />
          )}
        </Modal>
      )}
    </div>
  );
}

FormUploadVideo.defaultProps = {
  video: null
};
