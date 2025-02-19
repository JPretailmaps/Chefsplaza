import SeoMetaHead from '@components/common/seo-meta-head';
import Messenger from '@components/messages/Messenger';
import { resetMessageState } from '@redux/message/actions';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function Messages() {
  const distpatch = useDispatch();
  const router = useRouter();

  const { toSource, toId } = router.query;

  useEffect(() => () => {
    distpatch(resetMessageState());
  }, []);

  return (
    <div className="main-container">
      <SeoMetaHead pageTitle="Messages" />
      <Messenger toSource={`${toSource || ''}`} toId={`${toId || ''}`} />
    </div>
  );
}

Messages.authenticate = true;

export default Messages;
