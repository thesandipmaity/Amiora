'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password required'),
})
type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      // ── Step 1: Try hardcoded admin credentials first ──────────────
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      if (res.ok) {
        toast.success('Welcome back, Admin!')
        router.push('/dashboard')
        router.refresh()
        return
      }

      // ── Step 2: Fall back to Supabase Auth ────────────────────────
      const supabase = createBrowserClient()
      const { data: auth, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error

      const meta = auth.user?.user_metadata as { role?: string }
      if (meta?.role !== 'admin') {
        await supabase.auth.signOut()
        toast.error('Access denied. Admin privileges required.')
        return
      }

      toast.success('Welcome back, Admin!')
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sidebar-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-full bg-teal items-center justify-center mb-3">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl text-cream">AMIORA CMS</h1>
          <p className="text-sidebar-text text-sm mt-1">Admin Portal — Authorised Access Only</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/5 backdrop-blur rounded-2xl p-7 border border-white/10 space-y-5"
        >
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs text-sidebar-text uppercase tracking-wider">Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="admin@amiora.in"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-cream placeholder:text-white/30 outline-none focus:border-teal text-sm"
            />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs text-sidebar-text uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-cream placeholder:text-white/30 outline-none focus:border-teal text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-sidebar-active text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sidebar-text text-xs mt-6">
          © {new Date().getFullYear()} AMIORA Diamonds. All rights reserved.
        </p>
      </div>
    </div>
  )
}
