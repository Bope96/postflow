import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.tiktok.com' },
      { protocol: 'https', hostname: '**.tiktokcdn.com' },
      { protocol: 'https', hostname: '**.cdninstagram.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.tiktok.com https://*.tiktokcdn.com https://*.youtube.com https://*.instagram.com https://*.facebook.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.tiktok.com https://*.tiktokcdn.com https://*.cdninstagram.com https://*.fbcdn.net https://*.ytimg.com https://i.ytimg.com",
              "frame-src 'self' https://*.tiktok.com https://www.youtube.com https://www.instagram.com https://www.facebook.com",
              "connect-src 'self' https://*.tiktok.com https://*.tiktokcdn.com https://*.youtube.com https://*.instagram.com",
              "media-src 'self' blob: https://*.tiktok.com https://*.tiktokcdn.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
