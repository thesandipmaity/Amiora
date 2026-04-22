'use client'

import { useState }    from 'react'
import Link            from 'next/link'
import { useRouter }   from 'next/navigation'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }           from 'zod'
import { toast }       from 'sonner'
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  password:         z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path:    ['confirm_password'],
})
type FormData = z.infer<typeof schema>

export function ResetPasswordForm() {
  const router  = useRouter()
  const [loading,   setLoading]   = useState(false)
  const [showPw,    setShowPw]    = useState(false)
  const [showCPw,   setShowCPw]   = useState(false)
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ password }: FormData) => {
    setLoading(true)
    setAuthError('')
    const supabase = createBrowserClient()

    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setAuthError(error.message)
      return
    }
    toast.success('Password updated successfully!')
    router.push('/account')
    router.refresh()
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted text-center">
        Choose a new password for your AMIORA account.
      </p>

      {authError && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-widest text-ink-muted">New Password</label>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-deep-teal text-cream text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal disabled:opacity-50 transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <p className="text-center">
        <Link href="/login" className="text-sm text-ink-muted hover:text-teal transition-colors">
          Back to Sign In
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
