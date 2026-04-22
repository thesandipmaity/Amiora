import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password | AMIORA Diamonds',
  description: 'Reset your AMIORA Diamonds account password.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-1.5">
      <h1 className="font-display text-2xl text-ink text-center">Reset Password</h1>
      <div className="mb-6" />
      <ForgotPasswordForm />
    </div>
  )
}
