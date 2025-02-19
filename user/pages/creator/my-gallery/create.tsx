import { PictureOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import FormGallery from '@components/gallery/form-gallery';
import { showError } from '@lib/utils';
import { message } from 'antd';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IPerformer } from 'src/interfaces';
import { galleryService } from 'src/services';

interface IProps {
  user: IPerformer;
}

function GalleryCreatePage(props: IProps) {
  const [submiting, setsubmiting] = useState(false);

  useEffect(() => {
    const { user } = props;
    if (!user.verifiedDocument) {
      message.warning('Your ID documents are not verified yet! You could not post any content right now.');
      Router.back();
    }
  }, []);

  const onFinish = async (data) => {
    try {
      setsubmiting(true);
      const resp = await galleryService.create(data);
      message.success('New gallery created successfully');
      Router.push({ pathname: '/creator/my-gallery/update/[id]', query: { id: resp.data._id } }, `/creator/my-gallery/update/${resp.data._id}`);
    } catch (e) {
      showError(e);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <>
      <SeoMetaHead pageTitle="New Gallery" />
      <div className="main-container">
        <PageHeading title="New Gallery" icon={<PictureOutlined />} />
        <FormGallery
          submiting={submiting}
          onFinish={onFinish}
        />
      </div>
    </>
  );
}

GalleryCreatePage.authenticate = true;

GalleryCreatePage.onlyPerformer = true;

const mapStates = (state: any) => ({
  user: { ...state.user.current }
});

export default connect(mapStates)(GalleryCreatePage);
