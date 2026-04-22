import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PATHS = ['/login', '/auth', '/api/admin-login', '/_next', '/favicon']

const HARDCODED_COOKIE_NAME  = 'amiora_admin_session'
const HARDCODED_COOKIE_VALUE = 'amiora-admin-authenticated-2024'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // ── Check 1: Hardcoded admin cookie (works without Supabase) ──────
  const adminCookie = req.cookies.get(HARDCODED_COOKIE_NAME)
  if (adminCookie?.value === HARDCODED_COOKIE_VALUE) {
    return NextResponse.next()
  }

  // ── Check 2: Supabase Auth session (when Supabase is configured) ──
  try {
    const res = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookies) =>
            cookies.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            ),
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const meta = user.user_metadata as { role?: string }
      if (meta?.role === 'admin') {
        return res
      }
      await supabase.auth.signOut()
    }
  } catch {
    // Supabase not configured — fall through to login redirect
  }

  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
