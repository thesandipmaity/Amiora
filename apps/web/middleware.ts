import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/account', '/checkout']
const AUTH_PREFIXES      = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  // IMPORTANT: Must create supabaseResponse like this so cookies propagate
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Step 1: set on request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Step 2: create a fresh response that carries the updated request
          supabaseResponse = NextResponse.next({ request })
          // Step 3: set on the new response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do NOT put any logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect unauthenticated users away from protected routes
  if (!user && PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && AUTH_PREFIXES.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone()
    url.pathname = '/account'
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  // IMPORTANT: return supabaseResponse (not a new NextResponse)
  return supabaseResponse
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
    '/forgot-password',
  ],
}
