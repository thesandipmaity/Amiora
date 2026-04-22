const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amioradiamonds.in'

export interface BreadcrumbItem { name: string; href: string }

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.href}`,
    })),
  }
}

export function buildProductJsonLd({
  name, description, image, slug, price, reviewCount, avgRating,
}: {
  name: string; description: string; image?: string; slug: string
  price?: number; reviewCount?: number; avgRating?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image ?? '',
    url: `${BASE}/products/${slug}`,
    brand: { '@type': 'Brand', name: 'AMIORA' },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price.toFixed(2),
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${BASE}/products/${slug}`,
      },
    }),
    ...(reviewCount && avgRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }
}
