import type { Metadata } from 'next'
import { CustomizationPageClient } from '@/components/forms/CustomizationForm'

export const metadata: Metadata = {
  title: 'Custom Jewellery',
  description: 'Design your dream jewellery piece with Amiora Diamonds.',
}

export default function CustomizationPage() {
  return <CustomizationPageClient />
}
