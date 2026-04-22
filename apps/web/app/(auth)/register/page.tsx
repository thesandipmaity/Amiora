import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account | AMIORA Diamonds',
  description: 'Join AMIORA Diamonds and explore our exclusive jewellery collection.',
}

export default function RegisterPage() {
  return (
    <div className="space-y-1.5">
      <h1 className="font-display text-2xl text-ink text-center">Create Account</h1>
      <p className="text-sm text-ink-muted text-center mb-6">Join AMIORA Diamonds today</p>
      <RegisterForm />
    </div>
  )
}
