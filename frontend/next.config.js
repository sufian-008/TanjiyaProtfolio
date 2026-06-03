/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
  },
}

module.exports = nextConfig

