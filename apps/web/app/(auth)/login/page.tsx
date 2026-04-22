import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | AMIORA Diamonds',
  description: 'Sign in to your AMIORA Diamonds account.',
}

export default function LoginPage() {
  return (
    <div className="space-y-1.5">
      <h1 className="font-display text-2xl text-ink text-center">Welcome back</h1>
      <p className="text-sm text-ink-muted text-center mb-6">Sign in to your account</p>
      <LoginForm />
    </div>
  )
}
