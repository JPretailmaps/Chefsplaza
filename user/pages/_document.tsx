import { settingService } from '@services/setting.service';
import Document, {
  DocumentContext,
  Head, Html, Main, NextScript
} from 'next/document';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

interface P {
  favicon: string;
}

function CustomDocument({ favicon }: P) {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/x-icon" href={favicon || '/favicon.ico'} sizes="64x64" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta charSet="utf-8" />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

CustomDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => (
      <StyleProvider cache={cache} hashPriority="high">
        <ConfigProvider theme={{
          token: {
            colorPrimary: '#42b1e8',
            colorInfo: '#42b1e8',
            colorLink: '#42b1e8',
            colorSuccess: '#4ec52a'
          },
          hashed: false
        }}
        >
          <App {...props} />
        </ConfigProvider>
      </StyleProvider>
    )
  });

  const [initialProps, meta] = await Promise.all([
    Document.getInitialProps(ctx),
    settingService.valueByKeys([
      'favicon'
    ])
  ]);
  // 1.1 extract style which had been used
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    favicon: meta.favicon,
    styles: (
      <>
        {initialProps.styles}
        {/* 1.2 inject css */}
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    )
  };
};

export default CustomDocument;
