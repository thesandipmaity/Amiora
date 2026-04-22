'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@amiora/database'

interface UserState {
  user:    User | null
  loading: boolean
}

export function useUser(): UserState {
  const [state, setState] = useState<UserState>({ user: null, loading: true })

  useEffect(() => {
    const supabase = createBrowserClient()

    supabase.auth.getUser().then(({ data }) => {
      setState({ user: data.user, loading: false })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
