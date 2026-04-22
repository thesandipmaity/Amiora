'use client'

import { useState }    from 'react'
import Link            from 'next/link'
import { useRouter }   from 'next/navigation'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }           from 'zod'
import { toast }       from 'sonner'
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  full_name:        z.string().min(2, 'Full name must be at least 2 characters'),
  email:            z.string().email('Please enter a valid email'),
  password:         z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  terms:            z.boolean().refine(v => v, 'You must accept the terms'),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path:    ['confirm_password'],
})
type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const router  = useRouter()
  const [loading,   setLoading]   = useState(false)
  const [showPw,    setShowPw]    = useState(false)
  const [showCPw,   setShowCPw]   = useState(false)
  const [authError, setAuthError] = useState('')
  const [done,      setDone]      = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  })

  const onSubmit = async ({ email, password, full_name }: FormData) => {
    setLoading(true)
    setAuthError('')
    const supabase = createBrowserClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
    setLoading(false)

    if (error) {
      setAuthError(
        error.message.includes('already registered')
          ? 'This email is already registered. Please sign in.'
          : error.message
      )
      return
    }

    // If session exists immediately (email confirmation disabled in Supabase)
    if (data.session) {
      toast.success('Account created! Welcome to AMIORA.')
      window.location.href = '/account'
      return
    }

    // Email confirmation required
    setDone(true)
  }

  // ── Success / confirmation state ───────────────────────────────────────────
  if (done) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-teal" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl text-ink">Check your email</h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            We sent a confirmation link to your email address.<br />
            Click the link to activate your account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block text-sm text-teal hover:text-deep-teal transition-colors font-medium"
        >
          Back to Sign In →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Google OAuth */}
      <button
        type="button"
        onClick={async () => {
          const supabase = createBrowserClient()
          await supabase.auth.signInWithOAuth({
            provider: 'google',
            options:  { redirectTo: `${window.location.origin}/auth/callback` },
          })
        }}
        className="w-full flex items-center justify-center gap-3 py-3 border border-divider rounded-xl bg-white text-sm text-ink font-medium hover:border-teal hover:shadow-sm transition-all"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-divider" />
        <span className="text-xs text-ink-faint tracking-widest uppercase">or</span>
        <div className="flex-1 h-px bg-divider" />
      </div>

      {/* Error */}
      {authError && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-ink-muted">Full Name</label>
          <input
            {...register('full_name')}
            placeholder="Your full name"
            autoComplete="name"
            className={inputCls(!!errors.full_name)}
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-ink-muted">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls(!!errors.email)}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-ink-muted">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={`${inputCls(!!errors.password)} pr-10`}
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-ink-muted">Confirm Password</label>
          <div className="relative">
            <input
              {...register('confirm_password')}
              type={showCPw ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={`${inputCls(!!errors.confirm_password)} pr-10`}
            />
            <button type="button" onClick={() => setShowCPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition-colors">
              {showCPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password.message}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input {...register('terms')} type="checkbox" className="mt-0.5 h-3.5 w-3.5 accent-teal rounded" />
          <span className="text-xs text-ink-muted leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-teal hover:text-deep-teal underline-offset-2 underline">Terms of Use</Link>
            {' '}and{' '}
            <Link href="/return-policy" className="text-teal hover:text-deep-teal underline-offset-2 underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-deep-teal text-cream text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal disabled:opacity-50 transition-colors mt-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted pt-1">
        Already have an account?{' '}
        <Link href="/login" className="text-teal hover:text-deep-teal transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-ink placeholder-ink-faint
    focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors
    ${hasError ? 'border-red-300' : 'border-divider'}`
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
