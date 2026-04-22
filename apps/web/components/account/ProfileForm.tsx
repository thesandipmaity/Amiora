'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useForm }    from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }          from 'zod'
import { toast }      from 'sonner'
import { Loader2 }    from 'lucide-react'
import { createBrowserClient } from '@amiora/database'

const schema = z.object({
  full_name: z.string().min(2),
  phone:     z.string().optional(),
  dob:       z.string().optional(),
  gender:    z.enum(['male', 'female', 'other', '']).optional(),
})
type FormData = z.infer<typeof schema>

interface Profile {
  full_name: string | null
  phone:     string | null
  dob:       string | null
  gender:    string | null
}

export function ProfileForm({ user, profile }: { user: User; profile: Profile | null }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name ?? user.user_metadata?.['full_name'] ?? '',
      phone:     profile?.phone     ?? '',
      dob:       profile?.dob       ?? '',
      gender:    (profile?.gender   ?? '') as FormData['gender'],
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const supabase = createBrowserClient()
    const { error } = await supabase.from('user_profiles').upsert({ id: user.id, ...data })
    setLoading(false)
    if (error) { toast.error('Failed to save profile'); return }
    toast.success('Profile updated!')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-surface rounded-2xl p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-widest text-ink-muted">Personal Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-1.5">Full Name</label>
            <input {...register('full_name')} className={inputCls} />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-1.5">Email</label>
            <input value={user.email ?? ''} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-1.5">Phone</label>
            <input {...register('phone')} placeholder="+91 XXXXX XXXXX" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-1.5">Date of Birth</label>
            <input {...register('dob')} type="date" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-muted mb-1.5">Gender</label>
            <select {...register('gender')} className={inputCls}>
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-deep-teal text-cream px-8 py-3.5 text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-teal disabled:opacity-50 transition-colors"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </button>
    </form>
  )
}

const inputCls = 'w-full px-3 py-2.5 text-sm bg-bg border border-divider rounded-lg text-ink placeholder-ink-faint focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-colors'
