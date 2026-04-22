import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Toaster } from 'sonner'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Amiora Diamonds | Premium Jewellery',
    template: '%s | Amiora Diamonds',
  },
  description:
    'Handcrafted gold, diamond and silver jewellery. BIS hallmarked, live pricing, free shipping on orders ₹5000+.',
  keywords: ['diamond jewellery', 'gold jewellery', 'silver jewellery', 'hallmarked jewellery India'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Amiora Diamonds',
  },
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.amioradiamonds.in'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AMIORA Jewellery',
  url: BASE,
  logo: `${BASE}/logo.png`,
  sameAs: [
    'https://www.instagram.com/amiorajewellery',
    'https://www.facebook.com/amiorajewellery',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${jost.variable} font-body bg-bg text-ink antialiased`}
        suppressHydrationWarning
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
