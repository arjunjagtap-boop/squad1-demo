/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "frame-src 'self' https://*.nugget.com",
              "connect-src 'self' https://*.nugget.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.nugget.com;",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;