/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["cdn.jsdelivr.net", "api.dicebear.com", "sjc.microlink.io"],
    unoptimized: true,
  },
}

module.exports = nextConfig