'use server'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function adminSignInWithEmail(formData: FormData) {
  const supabase = await createServerClient()

  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Invalid email or password' }

  const meta = data.user?.user_metadata as { role?: string }
  if (meta?.role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'Access denied. Admin privileges required.' }
  }

  redirect('/dashboard')
}

export async function signInWithGoogle() {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.SITE_URL}/auth/callback`,
    },
  })

  if (error) redirect('/login?error=oauth_failed')
  redirect(data.url!)
}

export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()

  // Also clear the hardcoded admin session cookie
  const cookieStore = await cookies()
  cookieStore.delete('amiora_admin_session')

  redirect('/login')
}
