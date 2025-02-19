import { showError } from '@lib/utils';
import { commentService } from '@services/comment.service';
import { message, Spin } from 'antd';
import classNames from 'classnames';
import {
  forwardRef, useEffect, useImperativeHandle, useRef, useState
} from 'react';
import { IComment } from 'src/interfaces/index';

import CommentItem from './comment-item';
import style from './list-comments.module.scss';

type Props = {
  objectType: string;
  objectId: string;
  limit?: number;
  offset?: number;
  canReply?: boolean;
};

export const ListComments = forwardRef(({
  objectType,
  objectId,
  limit = 10,
  offset = 0,
  canReply = true
}: Props, ref) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    data: [],
    total: 0
  });
  const offsetRef = useRef(offset);

  const loadComments = async () => {
    try {
      setLoading(true);
      const resp = await commentService.search({
        objectId,
        objectType,
        limit,
        offset: offsetRef.current * limit
      });
      setData({
        data: [
          ...data.data,
          ...resp.data.data
        ],
        total: resp.data.total
      });
      setLoading(false);
    } catch (e) {
      showError(e);
      setLoading(false);
    }
  };

  const loadMore = () => {
    offsetRef.current += limit;
    loadComments();
  };

  const onDelete = async (item) => {
    try {
      // TODO - disable item here
      await commentService.delete(item._id);

      const index = data.data.findIndex((i) => i._id === item._id);
      if (index > -1) {
        const newData = [...data.data];
        newData.splice(index, 1);
        setData({
          data: newData,
          total: data.total - 1
        });
      }

      message.success('Removed successfully!');
    } catch (e) {
      showError(e);
    }
  };

  const appendNew = (item) => {
    const newData = [
      item,
      ...data.data
    ];
    setData({
      data: newData,
      total: data.total + 1
    });
  };

  useImperativeHandle(ref, () => ({
    appendNew
  }));

  useEffect(() => {
    if (objectId) loadComments();
  }, [objectId]);

  return (
    <div className={classNames(
      style['cmt-list']
    )}
    >
      {data.data.map(
        (comment: IComment) => (
          <CommentItem
            canReply={canReply}
            key={comment._id}
            item={comment}
            onDelete={onDelete}
          />
        )
      )}
      {loading && <div className="text-center" style={{ padding: '40px 0' }}><Spin /></div>}
      {!loading && !data.data.length && (
      <div className="text-center" style={{ padding: '30px 5px' }}>
        {objectType !== 'comment' ? 'Be the first to comment' : 'No reply comment'}
      </div>
      )}
      {!loading && data.data.length < data.total && (
        <p className="text-center">
          <a aria-hidden onClick={loadMore}>
            More comments
          </a>
        </p>
      )}
    </div>
  );
});

ListComments.defaultProps = {
  limit: 10,
  offset: 0,
  canReply: true
};
