/** @type {import('next').Config} */
const nextConfig = {
  images: {
    domains: ['tiktiktimer.com', 'localhost'],
    unoptimized: false,
  },
  // Add any redirects or rewrites you need
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 