'use client'

import { useState }    from 'react'
import Link            from 'next/link'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }           from 'zod'
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})
type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [loading,   setLoading]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }: FormData) => {
    setLoading(true)
    setAuthError('')
    const supabase = createBrowserClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)

    if (error) {
      setAuthError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-teal" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl text-ink">Email sent!</h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            We sent a password reset link to <span className="font-medium text-ink">{getValues('email')}</span>.
            <br />Check your inbox and follow the link.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-deep-teal transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted text-center">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      {authError && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-ink-muted">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-ink placeholder-ink-faint
              focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors
              ${errors.email ? 'border-red-300' : 'border-divider'}`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-deep-teal text-cream text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal disabled:opacity-50 transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-teal transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </p>
    </div>
  )
}
