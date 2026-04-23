export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Jost, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'sonner'
import '../styles/globals.css'
import { CMSShell } from '@/components/layout/CMSShell'

const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'], variable: '--font-cormorant', display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AMIORA CMS',
  description: 'Admin Content Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${cormorant.variable}`}>
      <body className="font-body antialiased bg-bg text-ink" suppressHydrationWarning>
        <CMSShell>{children}</CMSShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
