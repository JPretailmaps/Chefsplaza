const path = require('path');

/**
 * @type { import('next').NextConfig }
 */
const nextConfig = {
  compress: true,
  // react 18 about strict mode https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
  reactStrictMode: false,
  distDir: '.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. in development we need to run yarn lint
    ignoreDuringBuilds: true
  },
  images: {
    minimumCacheTTL: 300,
    remotePatterns: [{
      protocol: 'https',
      hostname: `**.${process.env.DOMAIN}`
    },
    {
      protocol: 'https',
      hostname: '**.xscripts.info'
    },
    {
      protocol: 'https',
      hostname: '**.googleusercontent.com'
    }
    ],
    domains: ['localhost']
  },
  rewrites() {
    return {
      afterFiles: [{
        // default landing page is login page
        source: '/',
        destination: '/chefsplaza/index.html'

      }]
    };
  },
  optimizeFonts: true,
  poweredByHeader: false,
  swcMinify: true,
  transpilePackages: ['antd', '@ant-design', 'rc-input', 'rc-util', 'rc-pagination', 'rc-picker', 'rc-notification', 'rc-tooltip', 'rc-tree', 'rc-table'],
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: process.env.API_SERVER_ENDPOINT || process.env.API_ENDPOINT
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: process.env.API_ENDPOINT,
    MAX_SIZE_IMAGE: process.env.MAX_SIZE_IMAGE || 5,
    MAX_SIZE_FILE: process.env.MAX_SIZE_FILE || 100,
    MAX_SIZE_TEASER: process.env.MAX_SIZE_TEASER || 200,
    MAX_SIZE_VIDEO: process.env.MAX_SIZE_VIDEO || 2000,
    HASH_PW_CLIENT: process.env.HASH_PW_CLIENT || true,
    DOMAIN: process.env.DOMAIN,
    SITE_URL: process.env.SITE_URL || `https://${process.env.DOMAIN}`
  }
};

module.exports = nextConfig;
