export const shimmer = (w = 256, h = 256) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#ccc" offset="20%" />
      <stop stop-color="#eee" offset="50%" />
      <stop stop-color="#ccc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#ccc" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) => (typeof window === 'undefined'
  ? Buffer.from(str).toString('base64')
  : window.btoa(str));

export const convertBlobUrlToFile = async (blobUrl: string, fileName: string) => {
  const blob = await fetch(blobUrl).then((r) => r.blob());
  return new File([blob], `${fileName}.${blob.type.split('/')[1]}`, { type: blob.type });
};

export const nextImageLoader = (({ src, width, quality }) => `${src}?w=${width}&q=${quality || 75}`);
