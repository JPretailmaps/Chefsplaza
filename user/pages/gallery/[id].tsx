import SeoMetaHead from '@components/common/seo-meta-head';
import {
  galleryService, photoService
} from '@services/index';
import {
  IGallery, IPhotos
} from 'src/interfaces';
import nextCookie from 'next-cookies';
import GalleryDetailsWrapper from '@components/gallery/details/gallery-details-wrapper';
import { NextPageContext } from 'next';

interface IProps {
  gallery: IGallery;
  photos: IPhotos[];
  relatedGalleries: IGallery[];
}

function GalleryViewPage({
  gallery, relatedGalleries, photos
}: IProps) {
  const thumbUrl = gallery.coverPhoto?.url;
  return (
    <>
      <SeoMetaHead item={gallery} imageUrl={thumbUrl || ''} />
      <GalleryDetailsWrapper gallery={gallery} relatedGalleries={relatedGalleries} photos={photos} />
    </>
  );
}

GalleryViewPage.authenticate = true;
GalleryViewPage.noredirect = true;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { query } = ctx;
  const { token } = nextCookie(ctx);
  try {
    const gallery = await galleryService.userViewDetails(`${query.id}`, {
      Authorization: token || ''
    });
    const [photos, relatedGalleries] = await Promise.all([
      photoService.userSearch({
        galleryId: gallery.data._id,
        limit: 200
      }, { Authorization: token || '' }),
      galleryService.userSearch({
        excludedId: gallery.data._id,
        limit: 24
      }, { Authorization: token || '' })
    ]);
    return {
      props: {
        gallery: gallery.data,
        photos: photos?.data?.data || [],
        relatedGalleries: relatedGalleries?.data?.data || []
      }
    };
  } catch (e) {
    return { notFound: true };
  }
};

GalleryViewPage.authenticate = true;
GalleryViewPage.noredirect = true;

export default GalleryViewPage;
