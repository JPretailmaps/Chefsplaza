/* eslint-disable jsx-a11y/label-has-associated-control */
import { PureComponent, createRef } from 'react';
import {
  Form, Input, Select, Upload, Button, message, Progress, Switch, DatePicker,
  Col, Row, InputNumber, Avatar, Modal
} from 'antd';
import { IVideo } from 'src/interfaces';
import { CameraOutlined, VideoCameraAddOutlined, FileAddOutlined } from '@ant-design/icons';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { performerService, videoService } from '@services/index';
import { FormInstance } from 'antd/lib/form';
import { debounce } from 'lodash';
import { VideoPlayer } from '@components/common';
import getConfig from 'next/config';
import dayjs from 'dayjs';

interface IProps {
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

export class FormUploadVideo extends PureComponent<IProps> {
  state = {
    previewThumbnail: null,
    previewVideo: null,
    previewTeaserVideo: null,
    isSaleVideo: false,
    isSchedule: false,
    scheduledAt: dayjs().add(1, 'day'),
    selectedVideo: null,
    selectedThumbnail: null,
    selectedTeaser: null,
    firstLoadPerformer: false,
    performers: [],
    removedTeaser: false,
    removedThumbnail: false,
    isShowPreview: false,
    previewUrl: '',
    previewType: ''
  };

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    const { video } = this.props;
    if (video) {
      this.setState(
        {
          previewThumbnail: video?.thumbnail,
          previewVideo: video?.video,
          isSaleVideo: video.isSale,
          previewTeaserVideo: video?.teaser,
          isSchedule: !!video?.isSchedule,
          scheduledAt: video?.scheduledAt || dayjs().add(1, 'day')
        }
      );
    }
    this.getPerformers('', video?.participantIds || '');
  }

  async handleRemovefile(type: string) {
    if (!window.confirm('Confirm to remove file!')) return;
    const { video } = this.props;
    try {
      await videoService.deleteFile(video._id, type);
      type === 'teaser' && this.setState({ removedTeaser: true });
      type === 'thumbnail' && this.setState({ removedThumbnail: true });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
    }
  }

  getPerformers = debounce(async (q, performerIds) => {
    try {
      const resp = await (await performerService.search({ q, performerIds: performerIds || '', limit: 99 })).data;
      const performers = resp.data || [];
      this.setState({ performers, firstLoadPerformer: true });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
      this.setState({ firstLoadPerformer: true });
    }
  }, 500);

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  previewModal = () => {
    const {
      isShowPreview, previewUrl, previewType
    } = this.state;
    return (
      <Modal
        width={767}
        footer={null}
        onOk={() => this.setState({ isShowPreview: false })}
        onCancel={() => this.setState({ isShowPreview: false })}
        visible={isShowPreview}
        destroyOnClose
      >
        {['teaser', 'video'].includes(previewType) && (
          <VideoPlayer
            {...{
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
          <img
            src={previewUrl}
            alt="thumbnail"
            width="100%"
            style={{ borderRadius: 5 }}
          />
        )}
      </Modal>
    );
  };

  beforeUpload(file: File, field: string) {
    const { beforeUpload: beforeUploadHandler } = this.props;
    const { publicRuntimeConfig: config } = getConfig();
    let maxSize = config.MAX_SIZE_FILE || 100;
    switch (field) {
      case 'thumbnail':
        maxSize = config.MAX_SIZE_IMAGE || 5;
        break;
      case 'teaser': maxSize = config.MAX_SIZE_TEASER || 200;
        break;
      case 'video': maxSize = config.MAX_SIZE_VIDEO || 2048;
        break;
      default: break;
    }
    const valid = file.size / 1024 / 1024 < maxSize;
    if (!valid) {
      // eslint-disable-next-line no-nested-ternary
      message.error(`${field === 'thumbnail' ? 'Thumbnail' : field === 'teaser' ? 'Teaser' : 'Video'} must be smaller than ${maxSize}MB!`);
      return false;
    }
    if (field === 'thumbnail') this.setState({ selectedThumbnail: file });
    if (field === 'teaser') this.setState({ selectedTeaser: file });
    if (field === 'video') this.setState({ selectedVideo: file });
    beforeUploadHandler(file, field);
    return true;
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      video, submit, uploading, uploadPercentage = 0
    } = this.props;
    const {
      previewThumbnail, previewVideo, isSchedule, previewTeaserVideo, scheduledAt,
      selectedTeaser, selectedThumbnail, selectedVideo, isSaleVideo, performers, firstLoadPerformer,
      removedTeaser, removedThumbnail
    } = this.state;
    const { publicRuntimeConfig: config } = getConfig();
    return (
      <Form
        {...layout}
        onFinish={(values) => {
          const data = { ...values };
          if (data.status === 'file-error') {
            message.error('Video file is on error, please upload new one');
            return;
          }
          if (data.isSchedule) {
            data.scheduledAt = scheduledAt;
          }
          if (data.tags && data.tags.length) {
            data.tags = data.tags.map((t) => t.replace(/\s+/g, '_').toLowerCase());
          }
          submit(data);
        }}
        name="video-form-upload"
        ref={this.formRef}
        initialValues={
          video || ({
            title: '',
            price: 9.99,
            description: '',
            status: 'active',
            performerId: '',
            tags: [],
            categoryIds: [],
            isSaleVideo: false,
            participantIds: [],
            isSchedule: false
          })
        }
        scrollToFirstError
      >
        <Form.Item name="performerId" label="Creator">
          <SelectPerformerDropdown
            defaultValue={video?.performerId || ''}
            onSelect={(val) => this.setFormVal('performerId', val)}
          />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{
            required: true, message: 'Please input video title'
          }]}
        >
          <Input placeholder="Enter video title" />
        </Form.Item>
        <Form.Item label="Tags" name="tags">
          <Select
            defaultValue={video?.tags || []}
            onChange={(val) => this.setFormVal('tags', val)}
            mode="tags"
            style={{ width: '100%' }}
            size="middle"
            showArrow={false}
            defaultActiveFirstOption={false}
            placeholder="Add Tags"
          />
        </Form.Item>
        <Form.Item
          label="Participants"
          name="participantIds"
        >
          {firstLoadPerformer && (
            <Select
              defaultValue={video?.participantIds || []}
              mode="multiple"
              style={{ width: '100%' }}
              showSearch
              placeholder="Search performers here"
              optionFilterProp="children"
              onSearch={this.getPerformers.bind(this)}
              loading={uploading}
            >
              {performers
                && performers.length > 0
                && performers.map((p) => (
                  <Select.Option key={p._id} value={p._id}>
                    <Avatar src={p?.avatar || '/no-avatar.jpg'} />
                    {' '}
                    {p?.name || p?.username || 'N/A'}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="isSaleVideo" label="For sale?" valuePropName="checked">
          <Switch unCheckedChildren="Subscribe to view" checkedChildren="Pay per view" onChange={(val) => this.setState({ isSaleVideo: val })} />
        </Form.Item>
        {isSaleVideo && (
          <Form.Item name="price" label="Price">
            <InputNumber min={1} />
          </Form.Item>
        )}
        <Form.Item name="isSchedule" label="Scheduled?" valuePropName="checked">
          <Switch unCheckedChildren="Not scheduled" checkedChildren="Scheduled" onChange={(checked) => this.setState({ isSchedule: checked })} />
        </Form.Item>
        {isSchedule && (
          <Form.Item label="Scheduled for">
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(currentDate) => currentDate < dayjs().endOf('day')}
              defaultValue={scheduledAt}
              onChange={(date) => this.setState({ scheduledAt: dayjs(date) })}
            />
          </Form.Item>
        )}
        <Row>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Video"
              help={
                (previewVideo && (
                  <a
                    aria-hidden
                    onClick={() => this.setState({
                      isShowPreview: true, previewUrl: previewVideo?.url, previewType: 'video'
                    })}
                  >
                    {previewVideo?.name || 'Click here to preview'}
                  </a>
                ))
                || (selectedVideo && <a>{selectedVideo?.name}</a>)
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
                beforeUpload={(file) => this.beforeUpload(file, 'video')}
              >
                {selectedVideo ? <FileAddOutlined /> : <VideoCameraAddOutlined />}
              </Upload>
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Teaser"
              help={
                (previewTeaserVideo && !removedTeaser && (
                  <a
                    aria-hidden
                    onClick={() => this.setState({
                      isShowPreview: true, previewUrl: previewTeaserVideo?.url, previewType: 'teaser'
                    })}
                  >
                    {previewTeaserVideo?.name || 'Click here to preview'}
                  </a>
                ))
                || (selectedTeaser && <a>{selectedTeaser?.name}</a>)
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
                beforeUpload={(file) => this.beforeUpload(file, 'teaser')}
              >
                {selectedTeaser ? <FileAddOutlined /> : <VideoCameraAddOutlined />}
              </Upload>
              {video?.teaserId && <Button disabled={removedTeaser} onClick={() => this.handleRemovefile('teaser')}>{!removedTeaser ? 'Remove Teaser' : 'Teaser was removed'}</Button>}
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Thumbnail"
              help={
                (previewThumbnail && !removedThumbnail && (
                  <a
                    aria-hidden
                    onClick={() => this.setState({
                      isShowPreview: true, previewUrl: previewThumbnail?.url, previewType: 'thumbnail'
                    })}
                  >
                    {previewThumbnail?.name || 'Click here to preview'}
                  </a>
                ))
                || (selectedThumbnail && <a>{selectedThumbnail?.name}</a>)
                || `Thumbnail is ${config.MAX_SIZE_IMAGE || 5}MB or below`
              }
            >
              <Upload
                customRequest={() => false}
                listType="picture-card"
                className="avatar-uploader"
                accept="image/*"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={(file) => this.beforeUpload(file, 'thumbnail')}
              >
                {selectedThumbnail ? <FileAddOutlined /> : <CameraOutlined />}
              </Upload>
              {video?.thumbnailId && <Button disabled={removedThumbnail} onClick={() => this.handleRemovefile('thumbnail')}>{!removedThumbnail ? 'Remove Thumbnail' : 'Thumbnail was removed'}</Button>}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive">
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        {uploadPercentage > 0 && (
          <Progress percent={Math.round(uploadPercentage)} />
        )}
        <Form.Item className="text-center mar-10">
          <Button type="primary" htmlType="submit" disabled={uploading} loading={uploading}>
            {video ? 'Update' : 'Upload'}
          </Button>
        </Form.Item>
        {this.previewModal()}
      </Form>
    );
  }
}
