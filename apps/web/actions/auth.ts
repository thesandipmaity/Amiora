'use server'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signupWithEmail(formData: FormData) {
  const supabase = await createServerClient()

  const email     = formData.get('email')     as string
  const password  = formData.get('password')  as string
  const full_name = formData.get('full_name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  })

  if (error) return { error: error.message }
  return { success: 'Check your email to confirm your account!' }
}

export async function loginWithEmail(formData: FormData) {
  const supabase = await createServerClient()

  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Invalid email or password' }

  redirect('/account')
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createServerClient()

  const callbackUrl = redirectTo
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: callbackUrl },
  })

  if (error) redirect('/login?error=oauth_failed')
  redirect(data.url!)
}

export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
