import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { skeletonLoading } from '@lib/loading';
import { ListComments } from './list-comments';

const CommentForm = dynamic(() => import('./comment-form'), { ssr: false, loading: skeletonLoading });

type Props = {
  objectType: string;
  objectId: string;
  limit?: number;
  offset?: number;
  canReply?: boolean;
};

function CommentWrapper({
  objectType,
  objectId,
  limit,
  offset,
  canReply
}: Props) {
  const listRef = useRef(null);
  const onSuccess = (values) => {
    listRef.current.appendNew(values);
  };
  return (
    <>
      <CommentForm
        onSuccess={onSuccess}
        objectId={objectId}
        objectType={objectType}
      />
      <ListComments
        key={`comments_${objectId}`}
        objectId={objectId}
        objectType={objectType}
        limit={limit}
        offset={offset}
        ref={listRef}
        canReply={canReply}
      />
    </>
  );
}

CommentWrapper.defaultProps = {
  limit: 10,
  offset: 0,
  canReply: true
};

export default CommentWrapper;
