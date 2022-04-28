/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['http://localhost:3000', 'https://robohash.org'],
  },
}

module.exports = nextConfig
