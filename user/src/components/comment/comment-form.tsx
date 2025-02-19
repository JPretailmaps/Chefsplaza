import {
  SendOutlined, SmileOutlined
} from '@ant-design/icons';
import { showError } from '@lib/utils';
import { commentService } from '@services/comment.service';
import {
  Button, Form, Input, message, Popover
} from 'antd';
import classNames from 'classnames';
import {
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { ICreateComment } from 'src/interfaces/comment';
import dynamic from 'next/dynamic';
import style from './comment-form.module.scss';

const Emotions = dynamic(() => (import('@components/common/emotions')), { ssr: false, loading: () => <div className="skeleton-loading" style={{ width: 300, height: 400 }} /> });

type Props = {
  objectId: string;
  objectType: string;
  onSuccess: Function;
  isReply?: boolean;
}

const { TextArea } = Input;

export function CommentForm({
  objectId,
  objectType,
  isReply,
  onSuccess = () => { }
}: Props) {
  const [formRef] = Form.useForm();
  const [submiting, setsubmiting] = useState(false);
  const loggedIn = useSelector<boolean>((state: any) => state.auth.loggedIn);

  // eslint-disable-next-line consistent-return
  const onFinish = async (values: ICreateComment) => {
    try {
      const data = { ...values };
      if (!loggedIn) {
        return message.error('Please login!');
      }
      if (!data.content) {
        return message.error('Please add a comment!');
      }
      if (data.content.length > 150) {
        return message.error('Comment cannot be over 150 characters');
      }
      setsubmiting(true);
      data.objectId = objectId;
      data.objectType = objectType || 'video';
      const res = await commentService.create(data);
      formRef.resetFields();
      onSuccess({ ...res.data, isAuth: true });
      message.success('Commented successfully');
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  const onEmojiClick = async (emoji) => {
    if (!loggedIn) return;
    formRef.setFieldsValue({
      content: `${formRef.getFieldValue('content') || ''} ${emoji} `
    });
  };

  return (
    <Form
      form={formRef}
      name="comment-form"
      onFinish={(val) => onFinish(val)}
      initialValues={{
        content: ''
      }}
    >
      <div className={classNames(
        style['comment-form']
      )}
      >
        <div className="cmt-area">
          <Form.Item
            name="content"
          >
            <TextArea
              disabled={!loggedIn}
              maxLength={150}
              showCount
              minLength={1}
              rows={!isReply ? 2 : 1}
              placeholder={!isReply ? 'Add a comment here' : 'Add a reply here'}
            />
          </Form.Item>
          <Popover
            key={objectId}
            className="emotion-popover"
            content={(
              <Emotions onEmojiClick={(emoji) => onEmojiClick(emoji)} />
            )}
            title={null}
            trigger="click"
          >
            <Button className="grp-emotions">
              <SmileOutlined />
            </Button>
          </Popover>
        </div>
        <Button className={!isReply ? style['submit-btn'] : ''} htmlType="submit" disabled={!loggedIn || submiting}>
          {!isReply ? <SendOutlined /> : 'Reply'}
        </Button>
      </div>
    </Form>
  );
}

CommentForm.defaultProps = {
  isReply: false
};

export default CommentForm;
