import type { Metadata } from 'next'
import Script from 'next/script'
import { CheckoutClient } from '@/components/checkout/CheckoutClient'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <CheckoutClient />
    </>
  )
}
