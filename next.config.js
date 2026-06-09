// const createNextIntlPlugin = require('next-intl/plugin');
 
// const withNextIntl = createNextIntlPlugin();
 
// /** @type {import('next').NextConfig} */
// const nextConfig = {};
 
// module.exports = withNextIntl(nextConfig);

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5047', // اختياري حسب حاجتك
        pathname: '/**', // للسماح بجميع المسارات
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
