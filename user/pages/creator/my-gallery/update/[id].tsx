import { PictureOutlined } from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import FormGallery from '@components/gallery/form-gallery';
import { getImageBase64, showError } from '@lib/utils';
import { photoService } from '@services/index';
import {
  message
} from 'antd';
import getConfig from 'next/config';
import Router from 'next/router';
import { NextPageContext } from 'next/types';
import { useEffect, useReducer, useState } from 'react';
import { IGallery } from 'src/interfaces';
import { galleryService } from 'src/services';
import nextCookie from 'next-cookies';
import { uniqBy } from 'lodash';

interface IProps {
  gallery: IGallery;
}

function GalleryUpdatePage({ gallery }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const [filesList, setFileList] = useState([]);

  const [, forceUpdate] = useReducer((s) => s + 1, 0);

  const onUploading = (file, resp: any) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    forceUpdate();
  };

  const handleUploadPhotos = async () => {
    const data = {
      galleryId: gallery._id,
      status: 'active'
    };
    const uploadFiles = filesList.filter(
      (f) => !f._id && !['uploading', 'done'].includes(f.status)
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (['uploading', 'done'].includes(file.status)) continue;
        file.status = 'uploading';
        // eslint-disable-next-line no-await-in-loop
        await photoService.uploadImages(
          file as any,
          data,
          (e) => onUploading(file, e)
        );
        file.status = 'done';
        file.response = { status: 'success' };
      } catch (e) {
        file.status = 'error';
        message.error(`File ${file?.name} error, please upload another file!`);
      }
    }
  };

  const onFinish = async (data) => {
    try {
      setSubmiting(true);
      await galleryService.update(gallery._id, data);
      await handleUploadPhotos();
      message.success('Updated successfully');
      Router.push('/creator/my-gallery');
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const getPhotosInGallery = async () => {
    const photos = await (await photoService.userSearch({
      galleryId: gallery._id,
      limit: 100
    })).data;
    setFileList(photos?.data || []);
  };

  const setCover = async (file) => {
    if (!file._id) {
      return;
    }
    try {
      setSubmiting(true);
      await photoService.setCoverGallery(file._id);
      message.success('Set new cover image success!');
      getPhotosInGallery();
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const removePhoto = async (file) => {
    if (!file._id) {
      setFileList((files) => files.filter((f) => f?.uid !== file?.uid));
      return;
    }
    if (!window.confirm('Are you sure you want to remove this photo?')) return;
    try {
      setSubmiting(true);
      await photoService.delete(file._id);
      setFileList((files) => files.filter((f) => f?._id !== file?._id));
    } catch (e) {
      showError(e);
    } finally {
      setSubmiting(false);
    }
  };

  const beforeUpload = (file, files) => {
    const { publicRuntimeConfig: config } = getConfig();
    const _files = uniqBy([...filesList, ...files], ((f) => f?._id || f?.uid));
    if (files.length > 100) {
      message.error('Please upload maximum 100 photos per gallery!');
      setFileList(_files.slice(0, 100));
      return false;
    }
    if (file.size / 1024 / 1024 > (config.MAX_SIZE_IMAGE || 5)) {
      message.error(`${file.name} is over ${config.MAX_SIZE_IMAGE || 5}MB`);
      return false;
    }
    getImageBase64(file, (imageUrl) => {
      // eslint-disable-next-line no-param-reassign
      file.thumbUrl = imageUrl;
      forceUpdate();
    });
    setFileList(_files);
    return true;
  };

  useEffect(() => {
    gallery?._id && getPhotosInGallery();
  }, [gallery]);

  return (
    <>
      <SeoMetaHead pageTitle="Update Gallery" />
      <div className="main-container">
        <PageHeading title="Update Gallery" icon={<PictureOutlined />} />
        <FormGallery
          gallery={gallery}
          onFinish={onFinish}
          submiting={submiting}
          filesList={filesList}
          handleBeforeUpload={beforeUpload}
          removePhoto={removePhoto}
          setCover={setCover}
        />
      </div>
    </>
  );
}

GalleryUpdatePage.authenticate = true;
GalleryUpdatePage.onlyPerformer = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const { token } = nextCookie(ctx);
    const gallery = await (await galleryService.findById(`${ctx.query.id}`, {
      Authorization: token || ''
    })).data;
    return {
      props: {
        gallery
      }
    };
  } catch (e) {
    return { notFound: true };
  }
};

export default GalleryUpdatePage;
