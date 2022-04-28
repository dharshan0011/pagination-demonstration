/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['http://localhost:3000', 'https://ibb.co'],
  },
}

module.exports = nextConfig
