import { authService } from '@services/auth.service';
import { message } from 'antd';
import Router from 'next/router';
import { NextPageContext } from 'next/types';

export function redirectLogin(ctx: NextPageContext) {
  if (typeof window !== 'undefined') {
    authService.removeToken();
    Router.replace('/auth/login');
    return;
  }
  // console.log(ctx);
  // fix for production build
  ctx.res.setHeader && ctx.res.setHeader('Set-Cookie', ['token=deleted; Max-Age=0']);
  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/auth/login' });
  ctx.res.end && ctx.res.end();
}

export function clearToken(ctx: NextPageContext) {
  if (typeof window !== 'undefined') {
    authService.removeToken();
    return;
  }
  // console.log(ctx);
  // fix for production build
  ctx.res.setHeader && ctx.res.setHeader('Set-Cookie', ['token=deleted; Max-Age=0']);
}

export function getImageBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export async function showError(e, text = 'Something went wrong, please try again later') {
  const error = await e;
  message.error(error?.message || error?.message?.message || text);
}

export function getThumbnail(item, defaultThumb = '/leaf.jpg') {
  const images = item.files?.filter((f) => f.type === 'feed-photo') || [];
  const videos = item.files?.filter((f) => f.type === 'feed-video') || [];
  return (item?.thumbnail?.thumbnails && item?.thumbnail?.thumbnails[0])
    || (images && images[0] && images[0]?.thumbnails && images[0]?.thumbnails[0])
    || (item?.teaser && item?.teaser?.thumbnails && item?.teaser?.thumbnails[0])
    || (videos && videos[0] && videos[0]?.thumbnails && videos[0]?.thumbnails[0])
    || defaultThumb;
}
