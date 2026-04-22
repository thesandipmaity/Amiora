import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@amiora/ui', '@amiora/database', '@amiora/types'],

  images: {
    formats: ['image/avif', 'image/webp'],   // modern formats → 40-60% smaller
    minimumCacheTTL: 3600,                   // CDN cache images for 1h
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co',         pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com',    pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com',   pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com',     pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com',     pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
    ],
  },

  experimental: {
    // Tree-shake these large packages — only used icons/components get bundled
    optimizePackageImports: ['@amiora/ui', 'lucide-react', 'framer-motion'],
  },

  // Compress responses
  compress: true,

  // Reduce build output noise
  logging: {
    fetches: { fullUrl: false },
  },
}

export default nextConfig
