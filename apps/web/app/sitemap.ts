import type { MetadataRoute } from 'next'
import { createServerClient } from '@amiora/database'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amioradiamonds.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()

  const [{ data: products }, { data: collections }, { data: blogs }, { data: categories }] = await Promise.all([
    supabase.from('products').select('slug, updated_at').eq('is_active', true),
    supabase.from('collections').select('slug, updated_at').eq('is_active', true),
    supabase.from('blogs').select('slug, updated_at').eq('is_published', true),
    supabase.from('categories').select('slug, updated_at'),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/shop`,          lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/collections`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/blogs`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/stores`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/customization`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/shipping-policy`,lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/return-policy`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url:              `${BASE}/products/${p.slug}`,
    lastModified:     p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency:  'daily',
    priority:         0.8,
  }))

  const collectionRoutes: MetadataRoute.Sitemap = (collections ?? []).map(c => ({
    url:             `${BASE}/collections/${c.slug}`,
    lastModified:    c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority:        0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (blogs ?? []).map(b => ({
    url:             `${BASE}/blogs/${b.slug}`,
    lastModified:    b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority:        0.6,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(c => ({
    url:             `${BASE}/shop?category=${c.slug}`,
    lastModified:    c.updated_at ? new Date(c.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority:        0.65,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...blogRoutes, ...categoryRoutes]
}
