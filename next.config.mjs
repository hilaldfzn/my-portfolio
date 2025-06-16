/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      domains: [
        'cdn.jsdelivr.net',
        'upload.wikimedia.org',
        'blob.v0.dev'
      ],
      formats: ['image/webp', 'image/avif'],
      minimumCacheTTL: 60,
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
      unoptimized: true,
    },
    experimental: {
      optimizeCss: true,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
    poweredByHeader: false,
    compress: true,
    swcMinify: true,
}
  
export default nextConfig  