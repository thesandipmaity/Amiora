import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@amiora/ui', '@amiora/database', '@amiora/types'],

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co',       pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com',  pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },

  experimental: {
    serverActions: { allowedOrigins: ['localhost:3001'] },
    // Reduce bundle size for heavy UI/icon packages
    optimizePackageImports: ['@amiora/ui', 'lucide-react', 'recharts', 'framer-motion'],
  },

  compress: true,
  logging: { fetches: { fullUrl: false } },
}

export default nextConfig
