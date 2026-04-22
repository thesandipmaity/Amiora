import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/account/ProfileForm'
import { redirect }    from 'next/navigation'

export const metadata: Metadata = { title: 'My Profile' }

export default async function ProfilePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single()

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-display-xl text-ink mb-8">My Profile</h1>
      <ProfileForm user={user} profile={profile} />
    </div>
  )
}
