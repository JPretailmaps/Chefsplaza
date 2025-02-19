import { IUIConfig } from '@interfaces/ui-config';
import { stripTags } from '@lib/string';
import { truncate } from 'lodash';
import getConfig from 'next/config';
import Head from 'next/head';
import { useSelector } from 'react-redux';

const { publicRuntimeConfig } = getConfig();
export interface ISeoMetaHeadProps {
  item?: any;
  imageUrl?: string;
  pageTitle?: string;
  keywords?: string | Array<string>;
  description?: string;
  metaTitle?: string;
  canonicalUrl?: string;
}
function SeoMetaHead({
  item = null,
  imageUrl = '',
  pageTitle = '',
  keywords = '',
  description = '',
  metaTitle = '',
  canonicalUrl = ''
}: ISeoMetaHeadProps) {
  const { siteName, logo, favicon }: IUIConfig = useSelector((state: any) => state.ui);
  const itemTitle = item?.title || item?.name || item?.username;
  const title = pageTitle || `${itemTitle} | ${siteName}`;
  const mTitle = metaTitle || title;
  let metaKeywords = keywords;
  if (Array.isArray(keywords)) metaKeywords = keywords.join(',');
  const metaDescription = stripTags(truncate(description || item?.description || item?.bio || item?.name || '', {
    length: 160
  }));

  return (
    <Head>
      <title>{title}</title>
      {/* {metaKeywords && <meta name="keywords" content={metaKeywords as string} />} */}
      {metaDescription && <meta name="description" content={metaDescription} />}
      {canonicalUrl && <meta property="canonical" content={canonicalUrl} />}
      {/* OG facebook */}
      <meta property="og:site_name" content={publicRuntimeConfig.DOMAIN} />
      <meta property="og:rich_attachment" content="true" />
      <meta property="og:type" content="profile" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {/* {metaKeywords && <meta property="og:keywords" content={metaKeywords as string} />} */}
      {metaDescription && <meta property="og:description" itemProp="description" content={metaDescription} />}
      {mTitle && <meta property="og:title" itemProp="headline" content={mTitle} key="title" />}
      {imageUrl && <meta property="og:image" itemProp="thumbnailUrl" content={imageUrl} />}
      {imageUrl && <meta property="og:image:secure_url" content={imageUrl} />}
      <meta property="og:image:alt" content={`${item?.username || siteName} thumb`} />
      <meta property="og:image:width" content="800" />
      <meta property="og:image:height" content="354" />
      <meta property="og:image:type" content="image/jpeg" />
      {/* twitter */}
      <meta name="twitter:domain" content={publicRuntimeConfig.DOMAIN} />
      <meta name="twitter:card" content="summary" />
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}
      {mTitle && <meta name="twitter:title" content={truncate(mTitle, { length: 70 })} />}
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {imageUrl && <meta property="twitter:image" content={imageUrl || favicon || logo || '/favicon.ico'} />}
      {item?.username && <meta property="twitter:image:alt" content={`Profile thumb ${item.username}`} />}
      {item?.username && <meta name="twitter:site" content={`@${item.username}`} />}
      {item?.username && <meta name="twitter:creator" content={`@${item.username}`} />}
    </Head>
  );
}

SeoMetaHead.defaultProps = {
  item: null,
  imageUrl: '',
  pageTitle: '',
  keywords: '',
  description: '',
  metaTitle: '',
  canonicalUrl: ''
};

export default SeoMetaHead;
