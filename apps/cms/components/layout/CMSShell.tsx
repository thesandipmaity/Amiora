'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'

const AUTH_ROUTES = ['/login', '/auth']

export function CMSShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = AUTH_ROUTES.some(r => pathname.startsWith(r))

  // Only enable Realtime when a real Supabase URL is configured
  const realtimeEnabled = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  )
  useRealtimeNotifications(realtimeEnabled)

  if (isAuth) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-60">
        <TopBar />
        <main className="flex-1 pt-14 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
