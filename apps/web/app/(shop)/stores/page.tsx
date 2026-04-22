import type { Metadata } from 'next'
import { StoresPageClient } from '@/components/stores/StoresPageClient'
import { createServerClient } from '@amiora/database'

export const metadata: Metadata = {
  title: 'Our Stores',
  description: 'Find an Amiora Diamonds store near you.',
}

export const dynamic = 'force-dynamic'

export default async function StoresPage() {
  const supabase = createServerClient()
  const { data: stores } = await supabase
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'AMIORA Jewellery',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amioradiamonds.in',
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amioradiamonds.in'}/logo.png`,
    priceRange: '₹₹₹',
    telephone: '+91-XXXXXXXXXX',
    '@graph': (stores ?? []).map(s => ({
      '@type': 'LocalBusiness',
      name: `AMIORA — ${s.name}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: s.address ?? '',
        addressLocality: s.city ?? '',
        addressRegion: s.state ?? '',
        postalCode: s.pincode ?? '',
        addressCountry: 'IN',
      },
      ...(s.lat && s.lng && {
        geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng }
      }),
      telephone: s.phone ?? '',
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <StoresPageClient stores={stores ?? []} />
    </>
  )
}
