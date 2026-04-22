import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Set New Password | AMIORA Diamonds',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#eee8df] flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-10 text-center">
        <p className="font-display text-4xl tracking-[0.3em] text-deep-teal">AMIORA</p>
        <p className="text-[10px] tracking-[0.4em] uppercase text-ink-faint mt-1">Diamonds &amp; Fine Jewellery</p>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-black/5 border border-white p-8 space-y-1.5">
        <h1 className="font-display text-2xl text-ink text-center">Set New Password</h1>
        <div className="mb-6" />
        <ResetPasswordForm />
      </div>
    </div>
  )
}
