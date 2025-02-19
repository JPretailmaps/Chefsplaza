import {
  FireOutlined, PictureOutlined, VideoCameraOutlined, AudioOutlined, VideoCameraAddOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import FeedForm from '@components/post/form';
import { IPerformer } from '@interfaces/index';
import { Tooltip, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import SeoMetaHead from '@components/common/seo-meta-head';
import classNames from 'classnames';
import { LiveIcon } from 'src/icons';
import style from './create.module.scss';

function CreatePost() {
  const router = useRouter();
  const user: IPerformer = useSelector((state: any) => state.user.current);

  const [chosenType, setChosenType] = useState(false);
  const [type, setType] = useState('');

  useEffect(() => {
    if (!user || !user.verifiedDocument) {
      message.warning('Your ID documents are not verified yet! You could not post any content right now.');
      router.back();
    }
  }, []);

  return (
    <>
      <SeoMetaHead pageTitle="New Post" />
      <div className="main-container">
        <PageHeading icon={<FireOutlined />} title={` New ${type} Post`} action={() => router.push('/creator/my-post')} />
        {!chosenType ? (
          <>
            <h3 className={style['heading-txt']}>Select a post type below:</h3>
            <div className={classNames(
              style['post-types']
            )}
            >
              <div aria-hidden className={style['type-item']} onClick={() => { setType('photo'); setChosenType(true); }}>
                <Tooltip title="Create a Photo post"><PictureOutlined /></Tooltip>
              </div>
              <div aria-hidden className={style['type-item']} onClick={() => { setType('video'); setChosenType(true); }}>
                <Tooltip title="Create a Video post"><VideoCameraOutlined /></Tooltip>
              </div>
              <div aria-hidden className={style['type-item']} onClick={() => { setType('text'); setChosenType(true); }}>
                <Tooltip title="Create a Text post">Aa</Tooltip>
              </div>
              <div aria-hidden className={style['type-item']} onClick={() => { setType('audio'); setChosenType(true); }}>
                <Tooltip title="Create a Audio post"><AudioOutlined /></Tooltip>
              </div>
              <div aria-hidden className={style['type-item']} onClick={() => { setType('scheduled-streaming'); setChosenType(true); }}>
                <Tooltip title="Create a Scheduled stream post"><LiveIcon /></Tooltip>
              </div>
            </div>
          </>
        ) : (<FeedForm type={type} discard={() => { setType(''); setChosenType(false); }} />)}
      </div>
    </>
  );
}

CreatePost.authenticate = true;

CreatePost.onlyPerformer = true;

export default CreatePost;
